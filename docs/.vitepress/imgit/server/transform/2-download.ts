import { CapturedAsset, DownloadedAsset, AssetType } from "../asset";
import { ensureDir, wait } from "../common";
import { platform } from "../platform";
import { config } from "../config";

const fetching = new Map<string, Promise<void>>;
const retrying = new Map<string, number>;

/** Downloads file content for the captured assets. */
export async function download(assets: CapturedAsset[]): Promise<DownloadedAsset[]> {
    const downloaded = new Array<DownloadedAsset>;
    for (const asset of assets)
        downloaded.push(await downloadAsset(asset));
    await Promise.all(fetching.values());
    return downloaded;
}

async function downloadAsset(asset: CapturedAsset): Promise<DownloadedAsset> {
    if (asset.type === AssetType.YouTube) return asset;
    const { local, log } = config;
    const { timeout, retries, delay } = config.download;
    const { fs, path } = platform;
    const sourcePath = path.resolve(buildLocalRoot(asset.sourceUrl), path.basename(asset.sourceUrl));
    const downloadedAsset: DownloadedAsset = { ...asset, sourcePath };
    if (await fs.exists(sourcePath) || fetching.has(sourcePath)) return downloadedAsset;
    const fetchPromise = fetchWithRetries(asset.sourceUrl, sourcePath);
    fetching.set(sourcePath, fetchPromise);
    return fetchPromise.then(() => downloadedAsset);

    async function fetchWithRetries(uri: string, filepath: string): Promise<void> {
        log?.info?.(`Downloading ${uri} to ${local}`);
        try { return fetchWithTimeout(uri, filepath); } catch (error) {
            retrying.set(filepath, (retrying.get(filepath) ?? 0) + 1);
            if (retrying.get(filepath)! > retries) {
                await fs.remove(filepath);
                throw error;
            }
            log?.warn?.(`Failed to download ${uri}, retrying. (error: ${error})`);
            await wait(Math.floor(Math.random() * delay));
            return fetchWithRetries(uri, filepath);
        }
    }

    function fetchWithTimeout(uri: string, filepath: string): Promise<void> {
        const abort = new AbortController();
        const timeoutId = setTimeout(abort.abort, timeout * 1000);
        try { return fetchAndWriteTo(uri, filepath, abort.signal); } finally { clearTimeout(timeoutId); }
    }

    async function fetchAndWriteTo(uri: string, filepath: string, signal: AbortSignal): Promise<void> {
        const response = await platform.fetch(uri, signal);
        if (response.status === 429) return handleRetryResponse(response);
        return write(response, filepath);
    }

    async function handleRetryResponse(response: Response): Promise<void> {
        const delay = Number(response.headers.get("retry-after"));
        if (isNaN(delay)) throw Error(`${asset.sourceUrl}: 429 without retry-after header (${delay}).`);
        log?.warn?.(`Too many fetch requests; the host asked to wait ${delay} seconds.`);
        await wait(delay + 1);
        return fetchWithTimeout(asset.sourceUrl, sourcePath);
    }
}

function buildLocalRoot(url: string): string {
    const path = platform.path;
    if (!url.startsWith(config.serve))
        return path.join(config.local, config.remote);
    const endIdx = url.length - path.basename(url).length;
    const subdir = url.substring(config.serve.length, endIdx);
    return path.join(config.local, subdir);
}

async function write(response: Response, filepath: string): Promise<void> {
    const { path, fs } = platform;
    await ensureDir(path.dirname(filepath));
    return fs.write(filepath, response.body!);
}

# API Reference

Script commands API reference. Use the side bar to quickly navigate between available commands. 

~~Strikethrough~~ indicates a nameless parameter, and **bold** stands for required parameter; other parameters should be considered optional. Consult [naninovel scripts guide](/guide/naninovel-scripts) in case you have no idea what's this all about.

The following parameters are supported by all the script commands:

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| if | string |  A boolean [script expression](/guide/script-expressions), controlling whether the command should execute. |
| wait | boolean | Whether the script player should wait for the async command to finish execution before executing the next one. Has no effect when the command is executed instantly. |

</div>

## animate

Animate properties of the actors with the specified IDs via key frames. Key frames for the animated parameters are delimited with commas.

::: info NOTE
It's not recommended to use this command for complex animations. Naniscript is a scenario scripting DSL and not suited for complex automation or specification such as animation. Consider using dedicated animation tools instead, such as Unity's [Animator](https://docs.unity3d.com/Manual/AnimationSection.html). <br /><br /> Be aware, that this command searches for actors with the provided IDs over all the actor managers, and in case multiple actors with the same ID exist (eg, a character and a text printer), this will affect only the first found one. <br /><br /> When running the animate commands in parallel (`wait` is set to false) the affected actors state can mutate unpredictably. This could cause unexpected results when rolling back or performing other commands that affect state of the actor. Make sure to reset affected properties of the animated actors (position, tint, appearance, etc) after the command finishes or use `@animate CharacterId` (without any args) to stop the animation prematurely.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">actorIds</span> | string list | IDs of the actors to animate. |
| loop | boolean | Whether to loop the animation; make sure to set `wait` to false when loop is enabled, otherwise script playback will loop indefinitely. |
| appearance | string | Appearances to set for the animated actors. |
| transition | string | Type of the [transition effect](/guide/transition-effects) to use when animating appearance change (crossfade is used by default). |
| visibility | string | Visibility status to set for the animated actors. |
| posX | string | Position values over X-axis (in 0 to 100 range, in percents from the left border of the scene) to set for the animated actors. |
| posY | string | Position values over Y-axis (in 0 to 100 range, in percents from the bottom border of the scene) to set for the animated actors. |
| posZ | string | Position values over Z-axis (in world space) to set for the animated actors; while in ortho mode, can only be used for sorting. |
| rotation | string | Rotation values (over Z-axis) to set for the animated actors. |
| scale | string | Scale (`x,y,z` or a single uniform value) to set for the animated actors. |
| tint | string | Tint colors to set for the animated actors. <br /><br /> Strings that begin with `#` will be parsed as hexadecimal in the following way: `#RGB` (becomes RRGGBB), `#RRGGBB`, `#RGBA` (becomes RRGGBBAA), `#RRGGBBAA`; when alpha is not specified will default to FF. <br /><br /> Strings that do not begin with `#` will be parsed as literal colors, with the following supported: red, cyan, blue, darkblue, lightblue, purple, yellow, lime, fuchsia, white, silver, grey, black, orange, brown, maroon, green, olive, navy, teal, aqua, magenta. |
| easing | string | Names of the easing functions to use for the animations. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | string | Duration of the animations per key, in seconds. When a key value is missing, will use one from a previous key. When not assigned, will use 0.35 seconds duration for all keys. |

</div>

```nani
; Animate `Kohaku` actor over three animation steps (key frames),
; changing positions: first step will take 1, second — 0.5 and third — 3 seconds.
@animate Kohaku posX:50,0,85 time:1,0.5,3

; Start loop animations of `Yuko` and `Kohaku` actors; notice, that you can skip
; key values indicating that the parameter shouldn't change during the animation step.
@animate Kohaku,Yuko loop:true appearance:Surprise,Sad,Default,Angry transition:DropFade,Ripple,Pixelate posX:15,85,50 posY:0,-25,-85 scale:1,1.25,1.85 tint:#25f1f8,lightblue,#ffffff,olive easing:EaseInBounce,EaseInQuad time:3,2,1,0.5 wait:false
...
; Stop the animations.
@animate Yuko,Kohaku loop:false

; Start a long background animation for `Kohaku`.
@animate Kohaku posX:90,0,90 scale:1,2,1 time:10 wait:false
; Do something else while the animation is running.
...
; Here we're going to set a specific position for the character,
; but the animation could still be running in background, so reset it first.
@animate Kohaku
; Now it's safe to modify previously animated properties.
@char Kohaku pos:50 scale:1
```

## append

Appends provided text to a text printer.

::: info NOTE
The entire text will be appended immediately, without triggering reveal effect or any other side-effects.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">text</span> | string | The text to append. |
| printer | string | ID of the printer actor to use. Will use a a default one when not provided. |
| author | string | ID of the actor, which should be associated with the appended text. |

</div>

```nani
; Print first part of the sentence as usual (with gradual reveal),
; then append the end of the sentence at once.
Lorem ipsum
@append " dolor sit amet."
```

## arrange

Arranges specified characters by X-axis. When no parameters provided, will execute an auto-arrange evenly distributing visible characters by X-axis.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">characterPositions</span> | named decimal list | A collection of character ID to scene X-axis position (relative to the left scene border, in percents) named values. Position 0 relates to the left border and 100 to the right border of the scene; 50 is the center. |
| look | boolean | When performing auto-arrange, controls whether to also make the characters look at the scene origin (enabled by default). |
| time | decimal | Duration (in seconds) of the arrangement animation. |

</div>

```nani
; Evenly distribute all the visible characters.
@arrange

; Place character with ID `Jenna` 15%, `Felix` 50% and `Mia` 85% away
; from the left border of the scene.
@arrange Jenna.15,Felix.50,Mia.85
```

## back

Modifies a [background actor](/guide/backgrounds).

::: info NOTE
Backgrounds are handled a bit differently from characters to better accommodate traditional VN game flow. Most of the time you'll probably have a single background actor on scene, which will constantly transition to different appearances. To remove the hassle of repeating same actor ID in scripts, it's possible to provide only the background appearance and transition type (optional) as a nameless parameter assuming `MainBackground` actor should be affected. When this is not the case, ID of the background actor can be explicitly provided via the `id` parameter.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">appearanceAndTransition</span> | named string | Appearance (or [pose](/guide/backgrounds#poses)) to set for the modified background and type of a [transition effect](/guide/transition-effects) to use. When transition is not provided, a cross-fade effect will be used by default. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the modified actor. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| id | string | ID of the actor to modify; specify `*` to affect all visible actors. |
| appearance | string | Appearance to set for the modified actor. |
| pose | string | Pose to set for the modified actor. |
| transition | string | Type of the [transition effect](/guide/transition-effects) to use (crossfade is used by default). |
| params | decimal list | Parameters of the transition effect. |
| dissolve | string | Path to the [custom dissolve](/guide/transition-effects#custom-transition-effects) texture (path should be relative to a `Resources` folder). Has effect only when the transition is set to `Custom` mode. |
| visible | boolean | Visibility status to set for the modified actor. |
| position | decimal list | Position (in world space) to set for the modified actor. Use Z-component (third member) to move (sort) by depth while in ortho mode. |
| rotation | decimal list | Rotation to set for the modified actor. |
| scale | decimal list | Scale to set for the modified actor. |
| tint | string | Tint color to set for the modified actor. <br /><br /> Strings that begin with `#` will be parsed as hexadecimal in the following way: `#RGB` (becomes RRGGBB), `#RRGGBB`, `#RGBA` (becomes RRGGBBAA), `#RRGGBBAA`; when alpha is not specified will default to FF. <br /><br /> Strings that do not begin with `#` will be parsed as literal colors, with the following supported: red, cyan, blue, darkblue, lightblue, purple, yellow, lime, fuchsia, white, silver, grey, black, orange, brown, maroon, green, olive, navy, teal, aqua, magenta. |
| easing | string | Name of the easing function to use for the modification. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Set `River` as the appearance of the main background.
@back River

; Same as above, but also use a `RadialBlur` transition effect.
@back River.RadialBlur

; Position `Smoke` background at the center of the screen
; and scale it 50% of the original size.
@back id:Smoke pos:50,50 scale:0.5

; Tint all visible backgrounds on scene.
@back id:* tint:#ffdc22
```

## bgm

Plays or modifies currently played [BGM (background music)](/guide/audio#background-music) track with the provided name.

::: info NOTE
Music tracks are looped by default. When music track name (BgmPath) is not specified, will affect all the currently played tracks. When invoked for a track that is already playing, the playback won't be affected (track won't start playing from the start), but the specified parameters (volume and whether the track is looped) will be applied.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">bgmPath</span> | string | Path to the music track to play. |
| intro | string | Path to the intro music track to play once before the main track (not affected by the loop parameter). |
| volume | decimal | Volume of the music track. |
| loop | boolean | Whether to play the track from beginning when it finishes. |
| fade | decimal | Duration of the volume fade-in when starting playback, in seconds (0.0 by default); doesn't have effect when modifying a playing track. |
| group | string | Audio mixer [group path](https://docs.unity3d.com/ScriptReference/Audio.AudioMixer.FindMatchingGroups) that should be used when playing the audio. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Starts playing a music track with the name `Sanctuary` in a loop.
@bgm Sanctuary

; Same as above, but fades-in the volume over 10 seconds and plays once.
@bgm Sanctuary fade:10 loop:false

; Changes volume of all the played music tracks to 50% over 2.5 seconds
; and makes them play in a loop.
@bgm volume:0.5 loop:true time:2.5

; Plays `BattleThemeIntro` once, then loops `BattleThemeMain`.
@bgm BattleThemeMain intro:BattleThemeIntro
```

## blur

Applies [blur effect](/guide/special-effects.html#blur) to supported actor: backgrounds and characters of sprite, layered, diced, Live2D, Spine, video and scene implementations.

::: info NOTE
The actor should have `IBlurable` interface implemented in order to support the effect.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">actorId</span> | string | ID of the actor to apply the effect for; in case multiple actors with the same ID found (eg, a character and a printer), will affect only the first found one. When not specified, applies to the main background. |
| power | decimal | Intensity of the effect, in 0.0 to 1.0 range. Defaults to 0.5. Set to 0 to disable (de-spawn) the effect. |
| time | decimal | How long it will take the parameters to reach the target values, in seconds. Defaults to 1.0. |

</div>

```nani
; Blur main background with default parameters.
@blur
; Remove blur from the main background.
@blur power:0

; Blur `Kohaku` actor with max power over 5 seconds.
@blur Kohaku power:1 time:5
; Remove blur from `Kohaku` over 3.1 seconds.
@blur Kohaku power:0 time:3.1
```

## bokeh

Simulates [depth of field](/guide/special-effects.html#depth-of-field-bokeh) (aka DOF, bokeh) effect, when only the object in focus stays sharp, while others are blurred.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| focus | string | Name of the game object to set focus for (optional). When set, the focus will always stay on the game object, while `dist` parameter will be ignored. |
| dist | decimal | Distance (in units) from Naninovel camera to the focus point. Ignored when `focus` parameter is specified. Defaults to 10. |
| power | decimal | Amount of blur to apply for the de-focused areas; also determines focus sensitivity. Defaults to 3.75. Set to 0 to disable (de-spawn) the effect. |
| time | decimal | How long it will take the parameters to reach the target values, in seconds. Defaults to 1.0. |

</div>

```nani
; Enable the effect with defaults and lock focus on `Kohaku` game object.
@bokeh focus:Kohaku
; Fade-off (disable) the effect over 10 seconds.
@bokeh power:0 time:10
; Set focus point 10 units away from the camera,
; focal distance to 0.95 and apply it over 3 seconds.
@bokeh dist:10 power:0.95 time:3
```

## br

Adds a line break to a text printer.

::: info NOTE
Consider using `<br>` tag instead with [TMPro printers](/guide/text-printers#textmesh-pro).
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">count</span> | integer | Number of line breaks to add. |
| printer | string | ID of the printer actor to use. Will use a default one when not provided. |
| author | string | ID of the actor, which should be associated with the appended line break. |

</div>

```nani
; Second sentence will be printed on a new line.
Lorem ipsum dolor sit amet.[br]Consectetur adipiscing elit.

; Second sentence will be printer two lines under the first one.
Lorem ipsum dolor sit amet.[br 2]Consectetur adipiscing elit.
```

## camera

Modifies the main camera, changing offset, zoom level and rotation over time. Check [this video](https://youtu.be/zy28jaMss8w) for a quick demonstration of the command effect.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| offset | decimal list | Local camera position offset in units by X,Y,Z axes. |
| roll | decimal | Local camera rotation by Z-axis in angle degrees (0.0 to 360.0 or -180.0 to 180.0). The same as third component of `rotation` parameter; ignored when `rotation` is specified. |
| rotation | decimal list | Local camera rotation over X,Y,Z-axes in angle degrees (0.0 to 360.0 or -180.0 to 180.0). |
| zoom | decimal | Relative camera zoom (orthographic size or field of view, depending on the render mode), in 0.0 (no zoom) to 1.0 (full zoom) range. |
| ortho | boolean | Whether the camera should render in orthographic (true) or perspective (false) mode. |
| toggle | string list | Names of the components to toggle (enable if disabled and vice-versa). The components should be attached to the same game object as the camera. This can be used to toggle [custom post-processing effects](/guide/special-effects#camera-effects). Use `*` to affect all the components attached to the camera object. |
| set | named boolean list | Names of the components to enable or disable. The components should be attached to the same game object as the camera. This can be used to explicitly enable or disable [custom post-processing effects](/guide/special-effects#camera-effects). Specified components enabled state will override effect of `toggle` parameter. Use `*` to affect all the components attached to the camera object. |
| easing | string | Name of the easing function to use for the modification. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the camera configuration settings. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Offset the camera by -3 units over X-axis and by 1.5 units Y-axis.
@camera offset:-3,1.5

; Set camera in perspective mode, zoom-in by 50% and move back by 5 units.
@camera ortho:false offset:,,-5 zoom:0.5

; Set camera in orthographic mode and roll by 10 degrees clock-wise.
@camera ortho:true roll:10

; Offset, zoom and roll simultaneously animated over 5 seconds.
@camera offset:-3,1.5 zoom:0.5 roll:10 time:5

; Instantly reset camera to the default state.
@camera offset:0,0 zoom:0 rotation:0,0,0 time:0

; Toggle `FancyCameraFilter` and `Bloom` components attached to the camera.
@camera toggle:FancyCameraFilter,Bloom

; Set `FancyCameraFilter` component enabled and `Bloom` disabled.
@camera set:FancyCameraFilter.true,Bloom.false

; Disable all components attached to the camera object.
@camera set:*.false
```

## char

Modifies a [character actor](/guide/characters).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">idAndAppearance</span> | named string | ID of the character to modify (specify `*` to affect all visible characters) and an appearance (or [pose](/guide/characters#poses)) to set. When appearance is not provided, will use either a `Default` (is exists) or a random one. |
| look | string | Look direction of the actor; supported values: left, right, center. |
| avatar | string | Name (path) of the [avatar texture](/guide/characters#avatar-textures) to assign for the character. Use `none` to remove (un-assign) avatar texture from the character. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the modified actor. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| id | string | ID of the actor to modify; specify `*` to affect all visible actors. |
| appearance | string | Appearance to set for the modified actor. |
| pose | string | Pose to set for the modified actor. |
| transition | string | Type of the [transition effect](/guide/transition-effects) to use (crossfade is used by default). |
| params | decimal list | Parameters of the transition effect. |
| dissolve | string | Path to the [custom dissolve](/guide/transition-effects#custom-transition-effects) texture (path should be relative to a `Resources` folder). Has effect only when the transition is set to `Custom` mode. |
| visible | boolean | Visibility status to set for the modified actor. |
| position | decimal list | Position (in world space) to set for the modified actor. Use Z-component (third member) to move (sort) by depth while in ortho mode. |
| rotation | decimal list | Rotation to set for the modified actor. |
| scale | decimal list | Scale to set for the modified actor. |
| tint | string | Tint color to set for the modified actor. <br /><br /> Strings that begin with `#` will be parsed as hexadecimal in the following way: `#RGB` (becomes RRGGBB), `#RRGGBB`, `#RGBA` (becomes RRGGBBAA), `#RRGGBBAA`; when alpha is not specified will default to FF. <br /><br /> Strings that do not begin with `#` will be parsed as literal colors, with the following supported: red, cyan, blue, darkblue, lightblue, purple, yellow, lime, fuchsia, white, silver, grey, black, orange, brown, maroon, green, olive, navy, teal, aqua, magenta. |
| easing | string | Name of the easing function to use for the modification. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Shows character with ID `Sora` with a default appearance.
@char Sora

; Same as above, but sets appearance to `Happy`.
@char Sora.Happy

; Same as above, but additionally positions the character 45% away 
; from the left border of the scene and 10% away from the bottom border; 
; also makes it look to the left.
@char Sora.Happy look:left pos:45,10

; Make Sora appear at the bottom-center and in front of Felix.
@char Sora pos:50,0,-1
@char Felix pos:,,0

; Tint all visible characters on scene.
@char * tint:#ffdc22
```

## choice

Adds a [choice](/guide/choices) option to a choice handler with the specified ID (or default one).

::: info NOTE
When `goto`, `gosub` and `do` parameters are not specified, will continue script execution from the next script line.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">choiceSummary</span> | string | Text to show for the choice. When the text contain spaces, wrap it in double quotes (`"`). In case you wish to include the double quotes in the text itself, escape them. |
| button | string | Path (relative to a `Resources` folder) to a [button prefab](/guide/choices#choice-button) representing the choice. The prefab should have a `ChoiceHandlerButton` component attached to the root object. Will use a default button when not provided. |
| pos | decimal list | Local position of the choice button inside the choice handler (if supported by the handler implementation). |
| handler | string | ID of the choice handler to add choice for. Will use a default handler if not provided. |
| goto | named string | Path to go when the choice is selected by user; see [@goto] command for the path format. |
| gosub | named string | Path to a subroutine to go when the choice is selected by user; see [@gosub] command for the path format. When `goto` is assigned this parameter will be ignored. |
| set | string | Set expression to execute when the choice is selected by user; see [@set] command for syntax reference. |
| do | string list | Script commands to execute when the choice is selected by user. Escape commas inside list values to prevent them being treated as delimiters. The commands will be invoked in order after `set`, `goto` and `gosub` are handled (if assigned). |
| play | boolean | Whether to automatically continue playing script from the next line, when neither `goto` nor `gosub` parameters are specified. Has no effect in case the script is already playing when the choice is processed. |
| show | boolean | Whether to also show choice handler the choice is added for; enabled by default. |
| time | decimal | Duration (in seconds) of the fade-in (reveal) animation. |

</div>

```nani
; Print the text, then immediately show choices and stop script execution.
Continue executing this script or ...?[skipInput]
@choice "Continue"
@choice "Load another script from start" goto:Another
@choice "Load another script from \"Label\" label" goto:Another.Label
@choice "Goto to \"Sub\" subroutine in another script" gosub:Another.Sub
@stop

; You can also set custom variables based on choices.
@choice "I'm humble, one is enough..." set:score++
@choice "Two, please." set:score=score+2
@choice "I'll take the entire stock!" set:karma--;score=999

; Play a sound effect and arrange characters when choice is picked.
@choice Arrange do:"@sfx Click, @arrange k.10\,y.55"

; Print a text line corresponding to the picked choice.
@choice "Ask about color" do:"What's your favorite color?"
@choice "Ask about age" do:"How old are you?"
@choice "Keep silent" do:"..."
@stop
```

## clearBacklog

Removes all the messages from [printer backlog](/guide/text-printers#printer-backlog).

```nani
; Printed text will be removed from the backlog.
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
@clearBacklog
```

## clearChoice

Removes all the choice options in the choice handler with the provided ID (or in default one, when ID is not specified; or in all the existing handlers, when `*` is specified as ID) and (optionally) hides it (them).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">handlerId</span> | string | ID of the choice handler to clear. Will use a default handler if not provided. Specify `*` to clear all the existing handlers. |
| hide | boolean | Whether to also hide the affected choice handlers. |

</div>

```nani
; Give the player 2 seconds to pick a choice.
# Start
You have 2 seconds to respond![skipInput]
@choice Cats goto:.PickedChoice
@choice Dogs goto:.PickedChoice
@wait 2
@clearChoice
Too late!
@stop
# PickedChoice
Good!
```

## despawn

Destroys an object spawned with [@spawn] command.

::: info NOTE
If prefab has a `MonoBehaviour` component attached the root object, and the component implements a `IParameterized` interface, will pass the specified `params` values before destroying the object; if the component implements `IAwaitable` interface, command execution will wait for the async completion task returned by the implementation before destroying the object.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">path</span> | string | Name (path) of the prefab resource to destroy. A [@spawn] command with the same parameter is expected to be executed before. |
| params | string list | Parameters to set before destroying the prefab. Requires the prefab to have a `IParameterized` component attached the root object. |

</div>

```nani
; Given `@spawn Rainbow` command was executed before, de-spawn (destroy) it.
@despawn Rainbow
```

## despawnAll

Destroys all the objects spawned with [@spawn] command. Equal to invoking [@despawn] for all the currently spawned objects.

```nani
@spawn Rainbow
@spawn SunShafts
; Will de-spawn (destroy) both rainbow and SunShafts.
@despawnAll
```

## else

Marks a branch of a conditional execution block, which is always executed in case conditions of the opening [@if] and all the preceding [@elseif] (if any) commands are not met. For usage examples see [conditional execution](/guide/naninovel-scripts#conditional-execution) guide.

## elseIf

Marks a branch of a conditional execution block, which is executed in case own condition is met (expression is evaluated to be true), while conditions of the opening [@if] and all the preceding [@elseif] (if any) commands are not met. For usage examples see [conditional execution](/guide/naninovel-scripts#conditional-execution) guide.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">expression</span> | string | A [script expression](/guide/script-expressions), which should return a boolean value. |

</div>

## endIf

Closes an [@if] conditional execution block. For usage examples see [conditional execution](/guide/naninovel-scripts#conditional-execution) guide.

## finishTrans

Finishes scene transition started with [@startTrans] command; see the start command reference for more information and usage examples.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">transition</span> | string | Type of the [transition effect](/guide/transition-effects) to use (crossfade is used by default). |
| params | decimal list | Parameters of the transition effect. |
| dissolve | string | Path to the [custom dissolve](/guide/transition-effects#custom-transition-effects) texture (path should be relative to a `Resources` folder). Has effect only when the transition is set to `Custom` mode. |
| easing | string | Name of the easing function to use for the modification. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | decimal | Duration (in seconds) of the transition. |

</div>

## glitch

Applies [digital glitch](/guide/special-effects.html#digital-glitch) post-processing effect to the main camera simulating digital video distortion and artifacts.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| time | decimal | The duration of the effect, in seconds; default is 1. |
| power | decimal | The intensity of the effect, in 0.0 to 10.0 range; default is 1. |

</div>

```nani
; Apply the glitch effect with default parameters.
@glitch
; Apply the effect over 3.33 seconds with a low intensity.
@glitch time:3.33 power:0.1
```

## gosub

Navigates naninovel script playback to the provided path and saves that path to global state; [@return] commands use this info to redirect to command after the last invoked gosub command.

::: info NOTE
While this command can be used as a function (subroutine) to invoke a common set of script lines, remember that NaniScript is a scenario scripting DSL and is not suited for general programming. It's strongly recommended to use [custom commands](/guide/custom-commands) instead.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">path</span> | named string | Path to navigate into in the following format: `ScriptName.LabelName`. When label name is omitted, will play provided script from the start. When script name is omitted, will attempt to find a label in the currently played script. |
| reset | string list | When specified, will reset the engine services state before loading a script (in case the path is leading to another script). Specify `*` to reset all the services, or specify service names to exclude from reset. By default, the state does not reset. |

</div>

```nani
; Navigate to `VictoryScene` label in the currently played script, then
; execute the commands and navigate back to the command after the `gosub`.
@gosub .VictoryScene
...
@stop
# VictoryScene
@back Victory
@sfx Fireworks
@bgm Fanfares
You are victorious!
@return

; Another example with some branching inside the subroutine.
@set time=10
; Here we get one result.
@gosub .Room
...
@set time=3
; And here we get another.
@gosub .Room
@stop
# Room
@print "It's too early, I should visit after sunset." if:time<21&time>6
@print "I can sense an ominous presence!" if:time>21|time<6
@return
```

## goto

Navigates naninovel script playback to the provided path.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">path</span> | named string | Path to navigate into in the following format: `ScriptName.LabelName`. When label name is omitted, will play provided script from the start. When script name is omitted, will attempt to find a label in the currently played script. |
| reset | string list | When specified, will control whether to reset the engine services state before loading a script (in case the path is leading to another script):<br /> - Specify `*` to reset all the services, except the ones with `Goto.DontReset` attribute.<br /> - Specify service type names (separated by comma) to exclude from reset; all the other services will be reset, including the ones with `Goto.DontReset` attribute.<br /> - Specify `-` to force no reset (even if it's enabled by default in the configuration).<br /><br /> Notice, that while some services have `Goto.DontReset` attribute applied and are not reset by default, they should still be specified when excluding specific services from reset. |

</div>

```nani
; Loads and starts playing `Script001` script from the start.
@goto Script001

; Save as above, but start playing from the label `AfterStorm`.
@goto Script001.AfterStorm

; Navigates to `Epilogue` label in the currently played script.
@goto .Epilogue
...
# Epilogue
...
```

## hide

Hides (removes) actors (character, background, text printer, choice handler) with the specified IDs. In case multiple actors with the same ID found (eg, a character and a printer), will affect only the first found one.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">actorIds</span> | string list | IDs of the actors to hide. |
| time | decimal | Duration (in seconds) of the fade animation. |
| remove | boolean | Whether to remove (destroy) the actor after it's hidden. Use to unload resources associated with the actor and prevent memory leaks. |

</div>

```nani
; Given an actor with ID `Smoke` is visible, hide it over 3 seconds.
@hide Smoke time:3

; Hide `Kohaku` and `Yuko` actors.
@hide Kohaku,Yuko

; Hide and remove `Kohaku` actor.
@hide Kohaku remove:true
```

## hideAll

Hides (removes) all the actors (characters, backgrounds, text printers, choice handlers) on scene.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| time | decimal | Duration (in seconds) of the fade animation. |
| remove | boolean | Whether to remove (destroy) the actors after they are hidden. Use to unload resources associated with the actors and prevent memory leaks. |

</div>

```nani
; Hide all the visible actors (chars, backs, printers, etc) on scene.
@hideAll

; Same as above, but also remove all the actors after they're hidden.
@hideAll remove:true
```

## hideChars

Hides (removes) all the visible characters on scene.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| time | decimal | Duration (in seconds) of the fade animation. |
| remove | boolean | Whether to remove (destroy) the characters after they are hidden. Use to unload resources associated with the characters and prevent memory leaks. |

</div>

```nani
; Hide all the visible character actors on scene.
@hideChars
```

## hidePrinter

Hides a text printer.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">printerId</span> | string | ID of the printer actor to use. Will use a default one when not provided. |
| time | decimal | Duration (in seconds) of the hide animation. Default value for each printer is set in the actor configuration. |

</div>

```nani
; Hide a default printer.
@hidePrinter

; Hide printer with ID `Wide`.
@hidePrinter Wide
```

## hideUI

Makes [UI elements](/guide/user-interface#ui-customization) with the specified names invisible. When no names are specified, will stop rendering (hide) the entire UI (including all the built-in UIs).

::: info NOTE
When hiding the entire UI with this command and `allowToggle` parameter is false (default), user won't be able to re-show the UI back with hotkeys or by clicking anywhere on the screen; use [@showUI] command to make the UI visible again.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">uINames</span> | string list | Name of the UI elements to hide. |
| allowToggle | boolean | When hiding the entire UI, controls whether to allow the user to re-show the UI with hotkeys or by clicking anywhere on the screen (false by default). Has no effect when hiding a particular UI. |
| time | decimal | Duration (in seconds) of the hide animation. When not specified, will use UI-specific duration. |

</div>

```nani
; Given a custom `Calendar` UI, the following command will hide it.
@hideUI Calendar

; Hide the entire UI, won't allow user to re-show it.
@hideUI
...
; Make the UI visible again.
@showUI

; Hide the entire UI, but allow the user to toggle it back.
@hideUI allowToggle:true

; Simultaneously hide built-in `TipsUI` and custom `Calendar` UIs.
@hideUI TipsUI,Calendar
```

## i

Holds script execution until user activates a `continue` input. Shortcut for `@wait i`.

```nani
; User will have to activate a `continue` input after the first sentence
; for the printer to continue printing out the following text.
Lorem ipsum dolor sit amet.[i] Consectetur adipiscing elit.
```

## if

Marks the beginning of a conditional execution block. Should always be closed with an [@endif] command. For usage examples see [conditional execution](/guide/naninovel-scripts#conditional-execution) guide.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">expression</span> | string | A [script expression](/guide/script-expressions), which should return a boolean value. |

</div>

## input

Shows an input field UI where user can enter an arbitrary text. Upon submit the entered text will be assigned to the specified custom variable.

::: info NOTE
Check out this [video guide](https://youtu.be/F9meuMzvGJw) on usage example. <br /><br /> To assign a display name for a character using this command consider [binding the name to a custom variable](/guide/characters.html#display-names).
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">variableName</span> | string | Name of a custom variable to which the entered text will be assigned. |
| summary | string | An optional summary text to show along with input field. When the text contain spaces, wrap it in double quotes (`"`). In case you wish to include the double quotes in the text itself, escape them. |
| value | string | A predefined value to set for the input field. |
| play | boolean | Whether to automatically resume script playback when user submits the input form. |

</div>

```nani
; Prompt to enter an arbitrary text and assign it to `name` custom variable.
@input name summary:"Choose your name."
; Halt the playback until player submits the input.
@stop

; You can then inject the assigned `name` variable in naninovel scripts.
Archibald: Greetings, {name}!

; ...or use it inside set and conditional expressions.
@set score=score+1 if:name=="Felix"
```

## lipSync

Allows to force-stop the lip sync mouth animation for a character with the provided ID; when stopped, the animation won't start again, until this command is used again to allow it. The character should be able to receive the lip sync events (currently generic, layered and Live2D implementations only). See [characters guide](/guide/characters#lip-sync) for more information on lip sync feature.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">charIdAndAllow</span> | named boolean | Character ID followed by a boolean (true or false) on whether to halt or allow the lip sync animation. |

</div>

```nani
; Given auto voicing is disabled and lip sync is driven by text messages,
; exclude punctuation from the mouth animation.
Kohaku: Lorem ipsum dolor sit amet[lipSync Kohaku.false]... [lipSync Kohaku.true]Consectetur adipiscing elit.
```

## loadScene

Loads a [Unity scene](https://docs.unity3d.com/Manual/CreatingScenes.html) with the provided name. Don't forget to add the required scenes to the [build settings](https://docs.unity3d.com/Manual/BuildSettings.html) to make them available for loading.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">sceneName</span> | string | Name of the scene to load. |
| additive | boolean | Whether to load the scene additively, or unload any currently loaded scenes before loading the new one (default). See the [load scene documentation](https://docs.unity3d.com/ScriptReference/SceneManagement.SceneManager.LoadScene.html) for more information. |

</div>

```nani
; Load scene `TestScene1` in single mode.
@loadScene TestScene1

; Load scene `TestScene2` in additive mode.
@loadScene TestScene2 additive:true
```

## lock

Sets an [unlockable item](/guide/unlockable-items) with the provided ID to `locked` state.

::: info NOTE
The unlocked state of the items is stored in [global scope](/guide/state-management#global-state).<br /> In case item with the provided ID is not registered in the global state map, the corresponding record will automatically be added.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">id</span> | string | ID of the unlockable item. Use `*` to lock all the registered unlockable items. |

</div>

```nani
; Lock an unlockable CG record with ID `FightScene1`.
@lock CG/FightScene1
```

## look

Activates/disables camera look mode, when player can offset the main camera with input devices (eg, by moving a mouse or using gamepad analog stick). Check [this video](https://youtu.be/rC6C9mA7Szw) for a quick demonstration of the command.

::: info NOTE
It's also possible to control the look by rotating a mobile device (in case it has a gyroscope). This requires using Unity's new input system and manually [enabling gyroscope](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.0/manual/Sensors.html) device. Check out [input example project](https://github.com/Naninovel/Input) for a reference on how to setup camera look with gyroscope.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">enable</span> | boolean | Whether to enable or disable the camera look mode. Default: true. |
| zone | decimal list | A bound box with X,Y sizes in units from the initial camera position, describing how far the camera can be moved. Default: 5,3. |
| speed | decimal list | Camera movement speed (sensitivity) by X,Y axes. Default: 1.5,1. |
| gravity | boolean | Whether to automatically move camera to the initial position when the look input is not active (eg, mouse is not moving or analog stick is in default position). Default: false. |

</div>

```nani
; Activate camera look mode with default parameters.
@look

; Activate camera look mode with custom parameters.
@look zone:6.5,4 speed:3,2.5 gravity:true

; Disable look mode and instantly reset the offset.
@look false

; Disable look, but reset gradually, with 0.25 speed.
@look false gravity:true speed:0.25
```

## movie

Plays a movie with the provided name (path).

::: info NOTE
Will fade-out the screen before playing the movie and fade back in after the play. Playback can be canceled by activating a `cancel` input (`Esc` key by default).
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">movieName</span> | string | Name of the movie resource to play. |
| time | decimal | Duration (in seconds) of the fade animation. When not specified, will use fade duration set in the movie configuration. |

</div>

```nani
; Given an `Opening` video clip is added to the movie resources, plays it.
@movie Opening
```

## openURL

Opens specified URL (web address) with default web browser.

::: info NOTE
When outside of WebGL or in editor, Unity's `Application.OpenURL` method is used to handle the command; consult the [documentation](https://docs.unity3d.com/ScriptReference/Application.OpenURL.html) for behaviour details and limitations. Under WebGL native `window.open()` JS function is invoked: https://developer.mozilla.org/en-US/docs/Web/API/Window/open.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">uRL</span> | string | URL to open. |
| target | string | Browsing context: _self (current tab), _blank (new tab), _parent, _top. |

</div>

```nani
; Open blank page in the current tab.
@openURL "about:blank"

; Open Naninovel website in new tab.
@openURL "https://naninovel.com" target:_blank
```

## print

Prints (reveals over time) specified text message using a text printer actor.

::: info NOTE
This command is used under the hood when processing generic text lines, eg generic line `Kohaku: Hello World!` will be automatically transformed into `@print "Hello World!" author:Kohaku` when parsing the naninovel scripts.<br /> Will reset (clear) the printer before printing the new message by default; set `reset` parameter to *false* or disable `Auto Reset` in the printer actor configuration to prevent that and append the text instead.<br /> Will make the printer default and hide other printers by default; set `default` parameter to *false* or disable `Auto Default` in the printer actor configuration to prevent that.<br /> Will wait for user input before finishing the task by default; set `waitInput` parameter to *false* or disable `Auto Wait` in the printer actor configuration to return as soon as the text is fully revealed.<br />
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">text</span> | string | Text of the message to print. When the text contain spaces, wrap it in double quotes (`"`). In case you wish to include the double quotes in the text itself, escape them. |
| printer | string | ID of the printer actor to use. Will use a default one when not provided. |
| author | string | ID of the actor, which should be associated with the printed message. |
| speed | decimal | Text reveal speed multiplier; should be positive or zero. Setting to one will yield the default speed. |
| reset | boolean | Whether to reset text of the printer before executing the printing task. Default value is controlled via `Auto Reset` property in the printer actor configuration menu. |
| default | boolean | Whether to make the printer default and hide other printers before executing the printing task. Default value is controlled via `Auto Default` property in the printer actor configuration menu. |
| waitInput | boolean | Whether to wait for user input after finishing the printing task. Default value is controlled via `Auto Wait` property in the printer actor configuration menu. |
| br | integer | Number of line breaks to prepend before the printed text. Default value is controlled via `Auto Line Break` property in the printer actor configuration menu. |
| fadeTime | decimal | Controls duration (in seconds) of the printers show and hide animations associated with this command. Default value for each printer is set in the actor configuration. |

</div>

```nani
; Will print the phrase with a default printer.
@print "Lorem ipsum dolor sit amet."

; To include quotes in the text itself, escape them.
@print "Shouting \"Stop the car!\" was a mistake."

; Reveal message with half of the normal speed and
; don't wait for user input to continue.
@print "Lorem ipsum dolor sit amet." speed:0.5 waitInput:false
```

## printer

Modifies a [text printer actor](/guide/text-printers).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">idAndAppearance</span> | named string | ID of the printer to modify and the appearance to set. When ID or appearance are not provided, will use default ones. |
| default | boolean | Whether to make the printer the default one. Default printer will be subject of all the printer-related commands when `printer` parameter is not specified. |
| hideOther | boolean | Whether to hide all the other printers. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the modified actor. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| id | string | ID of the actor to modify; specify `*` to affect all visible actors. |
| appearance | string | Appearance to set for the modified actor. |
| pose | string | Pose to set for the modified actor. |
| transition | string | Type of the [transition effect](/guide/transition-effects) to use (crossfade is used by default). |
| params | decimal list | Parameters of the transition effect. |
| dissolve | string | Path to the [custom dissolve](/guide/transition-effects#custom-transition-effects) texture (path should be relative to a `Resources` folder). Has effect only when the transition is set to `Custom` mode. |
| visible | boolean | Visibility status to set for the modified actor. |
| position | decimal list | Position (in world space) to set for the modified actor. Use Z-component (third member) to move (sort) by depth while in ortho mode. |
| rotation | decimal list | Rotation to set for the modified actor. |
| scale | decimal list | Scale to set for the modified actor. |
| tint | string | Tint color to set for the modified actor. <br /><br /> Strings that begin with `#` will be parsed as hexadecimal in the following way: `#RGB` (becomes RRGGBB), `#RRGGBB`, `#RGBA` (becomes RRGGBBAA), `#RRGGBBAA`; when alpha is not specified will default to FF. <br /><br /> Strings that do not begin with `#` will be parsed as literal colors, with the following supported: red, cyan, blue, darkblue, lightblue, purple, yellow, lime, fuchsia, white, silver, grey, black, orange, brown, maroon, green, olive, navy, teal, aqua, magenta. |
| easing | string | Name of the easing function to use for the modification. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Will make `Wide` printer default and hide any other visible printers.
@printer Wide

; Will assign `Right` appearance to `Bubble` printer, make is default,
; position at the center of the scene and won't hide other printers.
@printer Bubble.Right pos:50,50 hideOther:false
```

## processInput

Allows halting and resuming user input processing (eg, reacting to pressing keyboard keys). The effect of the action is persistent and saved with the game.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">inputEnabled</span> | boolean | Whether to enable input processing of all the samplers. |
| set | named boolean list | Allows muting and un-muting individual input samplers. |

</div>

```nani
; Halt input processing of all the samplers.
@processInput false

; Resume input processing of all the samplers.
@processInput true

; Mute `Rollback` and `Pause` inputs and un-mute `Continue` input.
@processInput set:Rollback.false,Pause.false,Continue.true
```

## purgeRollback

Prevents player from rolling back to the previous state snapshots.

```nani
; Prevent player from rolling back to try picking another choice.

Pick a choice. You won't be able to rollback.
@choice One goto:.One
@choice Two goto:.Two
@stop

# One
@purgeRollback
You've picked one.
@stop

# Two
@purgeRollback
You've picked two.
@stop
```

## rain

Spawns particle system simulating [rain](/guide/special-effects.html#rain).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| power | decimal | The intensity of the rain (particles spawn rate per second); defaults to 500. Set to 0 to disable (de-spawn) the effect. |
| time | decimal | The particle system will gradually grow the spawn rate to the target level over the specified time, in seconds. |
| xSpeed | decimal | Multiplier to the horizontal speed of the particles. Use to change angle of the rain drops. |
| ySpeed | decimal | Multiplier to the vertical speed of the particles. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the spawned effect game object. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| position | decimal list | Position (in world space) to set for the spawned effect game object. |
| rotation | decimal list | Rotation to set for the spawned effect game object. |
| scale | decimal list | Scale to set for the spawned effect game object. |

</div>

```nani
; Start intensive rain over 10 seconds.
@rain power:1500 time:10
; Stop the rain over 30 seconds.
@rain power:0 time:30
```

## resetState

Resets state of the [engine services](/guide/engine-services) and unloads (disposes) all the resources loaded by Naninovel (textures, audio, video, etc); will basically revert to an empty initial engine state.

::: info NOTE
The process is asynchronous and is masked with a loading screen ([ILoadingUI](/guide/user-interface#ui-customization)). <br /><br /> Be aware, that this command can not be undone (rewound back).
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">exclude</span> | string list | Names of the [engine services](/guide/engine-services) (interfaces) to exclude from reset. Consider adding `ICustomVariableManager` to preserve the local variables. |
| only | string list | Names of the [engine services](/guide/engine-services) (interfaces) to reset; other services won't be affected. Doesn't have effect when the nameless (exclude) parameter is assigned. |

</div>

```nani
; Reset all the services (script will stop playing).
@resetState

; Reset all the services except script player, custom variable and
; audio managers, allowing current script and audio tracks
; continue playing and preserving values of the custom variables.
@resetState IScriptPlayer,ICustomVariableManager,IAudioManager

; Reset only `ICharacterManager` and `IBackgroundManager` services
; removing all the character and background actors from scene
; and unloading associated resources from memory.
@resetState only:ICharacterManager,IBackgroundManager
```

## resetText

Resets (clears) the contents of a text printer and optionally resets author ID.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">printerId</span> | string | ID of the printer actor to use. Will use a default one when not provided. |
| resetAuthor | boolean | Whether to also reset author of the currently printed text message. |

</div>

```nani
; Print and then clear contents of the default printer.
This line will disappear.
@resetText

; Same as above, but with `Wide` printer.
@print "This line will disappear." printer:Wide
@resetText Wide
```

## return

Attempts to navigate naninovel script playback to a command after the last used [@gosub]. See [@gosub] command summary for more info and usage examples.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| reset | string list | When specified, will reset the engine services state before returning to the initial script from which the gosub was entered (in case it's not the currently played script). Specify `*` to reset all the services, or specify service names to exclude from reset. By default, the state does not reset. |

</div>

## save

Automatically save the game to a quick save slot.

## set

Assigns result of a [script expression](/guide/script-expressions) to a [custom variable](/guide/custom-variables).

::: info NOTE
If a variable with the provided name doesn't exist, it will be automatically created. <br /><br /> It's possible to define multiple set expressions in one line by separating them with `;`. The expressions will be executed in sequence by the order of declaration. <br /><br /> In case variable name starts with `T_` or `t_` it's considered a reference to a value stored in 'Script' [managed text](/guide/managed-text) document. Such variables can't be assigned and mostly used for referencing localizable text values.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">expression</span> | string | Set expression. <br /><br /> The expression should be in the following format: `VariableName=ExpressionBody`, where `VariableName` is the name of the custom variable to assign and `ExpressionBody` is a [script expression](/guide/script-expressions), the result of which should be assigned to the variable. <br /><br /> It's also possible to use increment and decrement unary operators (`@set foo++`, `@set foo--`) and compound assignment (`@set foo+=10`, `@set foo-=3`, `@set foo*=0.1`, `@set foo/=2`). |

</div>

```nani
; Assign `foo` variable a `bar` string value.
@set foo="bar"

; Assign `foo` variable a 1 number value.
@set foo=1

; Assign `foo` variable a `true` boolean value.
@set foo=true

; If `foo` is a number, add 0.5 to its value.
@set foo+=0.5

; If `angle` is a number, assign its cosine to `foo` variable.
@set foo=Cos(angle)

; Get random number between -100 and 100, then raise to power of 4 
; and assign to `foo` variable. Quotes are required when whitespace 
; is present inside the expression.
@set "foo = Pow(Random(-100, 100), 4)"

; If `foo` is a number, add 1 to its value (increment).
@set foo++

; If `foo` is a number, subtract 1 from its value (decrement).
@set foo--

; Assign `foo` variable value of the `bar` variable, 
; which is `Hello World!` string.
@set bar="Hello World!"
@set foo=bar

; Defining multiple set expressions in one line; 
; the result will be the same as above.
@set bar="Hello World!";foo=bar

; It's possible to inject variables to naninovel script command parameters.
@set scale=0
# EnlargeLoop
@char Kohaku.Default scale:{scale}
@set scale+=0.1
@goto .EnlargeLoop if:scale<1

; ...and generic text lines.
@set drink="Dr. Pepper"
My favourite drink is {drink}!

; When using double quotes inside text expression value, escape them.
@set remark="Shouting \"Stop the car!\" was a mistake."

; Use global variable to indicate player reaching `Ending 001`.
; The variable will remain true even when the game is restarted.
@set g_Ending001Reached=true

; Increment the global variable only once, even when re-played.
@set g_GlobalCounter++ if:!HasPlayed()
```

## sfx

Plays or modifies currently played [SFX (sound effect)](/guide/audio#sound-effects) track with the provided name.

::: info NOTE
Sound effect tracks are not looped by default. When sfx track name (SfxPath) is not specified, will affect all the currently played tracks. When invoked for a track that is already playing, the playback won't be affected (track won't start playing from the start), but the specified parameters (volume and whether the track is looped) will be applied.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">sfxPath</span> | string | Path to the sound effect asset to play. |
| volume | decimal | Volume of the sound effect. |
| loop | boolean | Whether to play the sound effect in a loop. |
| fade | decimal | Duration of the volume fade-in when starting playback, in seconds (0.0 by default); doesn't have effect when modifying a playing track. |
| group | string | Audio mixer [group path](https://docs.unity3d.com/ScriptReference/Audio.AudioMixer.FindMatchingGroups) that should be used when playing the audio. |
| time | decimal | Duration (in seconds) of the modification. |

</div>

```nani
; Plays an SFX with the name `Explosion` once.
@sfx Explosion

; Plays an SFX with the name `Rain` in a loop and fades-in over 30 seconds.
@sfx Rain loop:true fade:30

; Changes volume of all the played SFX tracks to 75% over 2.5 seconds
; and disables looping for all of them.
@sfx volume:0.75 loop:false time:2.5
```

## sfxFast

Plays an [SFX (sound effect)](/guide/audio#sound-effects) track with the provided name. Unlike [@sfx] command, the clip is played with minimum delay and is not serialized with the game state (won't be played after loading a game, even if it was played when saved). The command can be used to play various transient audio clips, such as UI-related sounds (eg, on button click with [`Play Script` component](/guide/user-interface#play-script-on-unity-event)).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">sfxPath</span> | string | Path to the sound effect asset to play. |
| volume | decimal | Volume of the sound effect. |
| restart | boolean | Whether to start playing the audio from start in case it's already playing. |
| additive | boolean | Whether to allow playing multiple instances of the same clip; has no effect when `restart` is enabled. |
| group | string | Audio mixer [group path](https://docs.unity3d.com/ScriptReference/Audio.AudioMixer.FindMatchingGroups) that should be used when playing the audio. |

</div>

```nani
; Plays an SFX with the name `Click` once.
@sfxFast Click

; Same as above, but allow concurrent playbacks of the same clip.
@sfxFast Click restart:false
```

## shake

Applies [shake effect](/guide/special-effects.html#shake) for the actor with the specified ID or main camera.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">actorId</span> | string | ID of the actor to shake. In case multiple actors with the same ID found (eg, a character and a printer), will affect only the first found one. To shake main camera, use "Camera" keyword. |
| count | integer | The number of shake iterations. When set to 0, will loop until stopped with -1. |
| time | decimal | The base duration of each shake iteration, in seconds. |
| deltaTime | decimal | The randomizer modifier applied to the base duration of the effect. |
| power | decimal | The base displacement amplitude of each shake iteration, in units. |
| deltaPower | decimal | The randomized modifier applied to the base displacement amplitude. |
| hor | boolean | Whether to displace the actor horizontally (by x-axis). |
| ver | boolean | Whether to displace the actor vertically (by y-axis). |

</div>

```nani
; Shake `Dialogue` text printer with default params.
@shake Dialogue
;
; Start shaking `Kohaku` character, show choice to stop and act accordingly.
@shake Kohaku count:0 wait:false
@choice "Continue shaking" goto:.Continue
@choice "Stop shaking" goto:.Stop
@stop
# Stop
@shake Kohaku count:-1
# Continue
...

; Shake main Naninovel camera horizontally 5 times.
@shake Camera count:5 hor:true ver:false
```

## show

Shows (makes visible) actors (character, background, text printer, choice handler, etc) with the specified IDs. In case multiple actors with the same ID found (eg, a character and a printer), will affect only the first found one.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">actorIds</span> | string list | IDs of the actors to show. |
| time | decimal | Duration (in seconds) of the fade animation. |

</div>

```nani
; Given an actor with ID `Smoke` is hidden, reveal it over 3 seconds.
@show Smoke time:3

; Show `Kohaku` and `Yuko` actors.
@show Kohaku,Yuko
```

## showPrinter

Shows a text printer.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">printerId</span> | string | ID of the printer actor to use. Will use a default one when not provided. |
| time | decimal | Duration (in seconds) of the show animation. Default value for each printer is set in the actor configuration. |

</div>

```nani
; Show a default printer.
@showPrinter

; Show printer with ID `Wide`.
@showPrinter Wide
```

## showUI

Makes [UI elements](/guide/user-interface) with the specified resource names visible. When no names are specified, will reveal the entire UI (in case it was hidden with [@hideUI]).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">uINames</span> | string list | Name of the UI resource to make visible. |
| time | decimal | Duration (in seconds) of the show animation. When not specified, will use UI-specific duration. |

</div>

```nani
; Given you've added a custom UI with `Calendar` name,
; the following will make it visible on the scene.
@showUI Calendar

; Given you've hidden the entire UI with @hideUI, show it back.
@showUI

; Simultaneously reveal built-in `TipsUI` and custom `Calendar` UIs.
@showUI TipsUI,Calendar
```

## skip

Allows to enable or disable script player "skip" mode.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">enable</span> | boolean | Whether to enable (default) or disable the skip mode. |

</div>

```nani
; Enable skip mode.
@skip

; Disable skip mode.
@skip false
```

## skipInput

Can be used in generic text lines to prevent activating `wait for input` mode when the text is printed.

```nani
; Script player won't wait for continue input before executing @sfx command.
And the rain starts.[skipInput]
@sfx Rain
```

## slide

Slides (moves between two positions) an actor (character, background, text printer or choice handler) with the provided ID and optionally changes actor visibility and appearance. Can be used instead of multiple [@char] or [@back] commands to reveal or hide an actor with a slide animation.

::: info NOTE
Be aware, that this command searches for an existing actor with the provided ID over all the actor managers, and in case multiple actors with the same ID exist (eg, a character and a text printer), this will affect only the first found one. Make sure the actor exist on scene before referencing it with this command; eg, if it's a character, you can add it on scene imperceptibly to player with `@char CharID visible:false time:0`.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">idAndAppearance</span> | named string | ID of the actor to slide and (optionally) appearance to set. |
| from | decimal list | Position in scene space to slide the actor from (slide start position). Described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene; Z-component (depth) is in world space. When not provided, will use current actor position in case it's visible and a random off-scene position otherwise (could slide-in from left or right borders). |
| <span class="command-param-required" title="Required parameter: parameter should always be specified">to</span> | decimal list | Position in scene space to slide the actor to (slide finish position). |
| visible | boolean | Change visibility status of the actor (show or hide). When not set and target actor is hidden, will still automatically show it. |
| easing | string | Name of the easing function to use for the modifications. <br /><br /> Available options: Linear, SmoothStep, Spring, EaseInQuad, EaseOutQuad, EaseInOutQuad, EaseInCubic, EaseOutCubic, EaseInOutCubic, EaseInQuart, EaseOutQuart, EaseInOutQuart, EaseInQuint, EaseOutQuint, EaseInOutQuint, EaseInSine, EaseOutSine, EaseInOutSine, EaseInExpo, EaseOutExpo, EaseInOutExpo, EaseInCirc, EaseOutCirc, EaseInOutCirc, EaseInBounce, EaseOutBounce, EaseInOutBounce, EaseInBack, EaseOutBack, EaseInOutBack, EaseInElastic, EaseOutElastic, EaseInOutElastic. <br /><br /> When not specified, will use a default easing function set in the actor's manager configuration settings. |
| time | decimal | Duration (in seconds) of the slide animation. |

</div>

```nani
; Given `Jenna` actor is not visible, reveal it with an `Angry` appearance
; and slide to the center from either left or right border of the scene.
@slide Jenna.Angry to:50

; Given `Sheba` actor is currently visible,
; hide and slide it out of the scene over the left border.
@slide Sheba to:-10 visible:false


; Slide `Mia` actor from left-center side of the scene to the right-bottom
; over 5 seconds using `EaseOutBounce` animation easing.
@slide Sheba from:15,50 to:85,0 time:5 easing:EaseOutBounce
```

## snow

Spawns particle system simulating [snow](/guide/special-effects.html#snow).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| power | decimal | The intensity of the snow (particles spawn rate per second); defaults to 100. Set to 0 to disable (de-spawn) the effect. |
| time | decimal | The particle system will gradually grow the spawn rate to the target level over the specified time, in seconds. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the spawned effect game object. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| position | decimal list | Position (in world space) to set for the spawned effect game object. |
| rotation | decimal list | Rotation to set for the spawned effect game object. |
| scale | decimal list | Scale to set for the spawned effect game object. |

</div>

```nani
; Start intensive snow over 10 seconds.
@snow power:300 time:10
; Stop the snow over 30 seconds.
@snow power:0 time:30
```

## spawn

Instantiates a prefab or a [special effect](/guide/special-effects); when performed over an already spawned object, will update the spawn parameters instead.

::: info NOTE
If prefab has a `MonoBehaviour` component attached the root object, and the component implements a `IParameterized` interface, will pass the specified `params` values after the spawn; if the component implements `IAwaitable` interface, command execution will wait for the async completion task returned by the implementation.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">path</span> | string | Name (path) of the prefab resource to spawn. |
| params | string list | Parameters to set when spawning the prefab. Requires the prefab to have a `IParameterized` component attached the root object. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the spawned object. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| position | decimal list | Position (in world space) to set for the spawned object. |
| rotation | decimal list | Rotation to set for the spawned object. |
| scale | decimal list | Scale to set for the spawned object. |

</div>

```nani
; Given a `Rainbow` prefab is assigned in spawn resources, instantiate it.
@spawn Rainbow
```

## startTrans

Begins scene transition masking the real scene content with anything that is visible at the moment (except the UI). When the new scene is ready, finish with [@finishTrans] command.

::: info NOTE
The UI will be hidden and user input blocked while the transition is in progress. You can change that by overriding the `ISceneTransitionUI`, which handles the transition process.<br /><br /> For the list of available transition effect options see [transition effects](/guide/transition-effects) guide.
:::

```nani
; Transition Felix on sunny day with Jenna on rainy day.
@char Felix
@back SunnyDay
@spawn SunShafts
@startTrans
; Following modifications won't be visible until the transition is finished.
@hideChars time:0
@char Jenna time:0
@back RainyDay time:0
@despawn SunShafts params:0
@spawn Rain params:,0
; Transition the initially captured scene to the new one
; with `DropFade` effect over 3 seconds.
@finishTrans DropFade time:3
```

## stop

Stops the naninovel script execution.

```nani
Show the choices and halt script execution until the player picks one.
@choice "Choice 1"
@choice "Choice 2"
@stop
We'll get here after player will make a choice.
```

## stopBgm

Stops playing a BGM (background music) track with the provided name.

::: info NOTE
When music track name (BgmPath) is not specified, will stop all the currently played tracks.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">bgmPath</span> | string | Path to the music track to stop. |
| fade | decimal | Duration of the volume fade-out before stopping playback, in seconds (0.35 by default). |

</div>

```nani
; Fades-out `Sanctuary` bgm track over 10 seconds and stops the playback.
@stopBgm Sanctuary fade:10

; Stops all the currently played music tracks.
@stopBgm
```

## stopSfx

Stops playing an SFX (sound effect) track with the provided name.

::: info NOTE
When sound effect track name (SfxPath) is not specified, will stop all the currently played tracks.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">sfxPath</span> | string | Path to the sound effect to stop. |
| fade | decimal | Duration of the volume fade-out before stopping playback, in seconds (0.35 by default). |

</div>

```nani
; Stop playing an SFX with the name `Rain`, fading-out for 15 seconds.
@stopSfx Rain fade:15

; Stops all the currently played sound effect tracks.
@stopSfx
```

## stopVoice

Stops playback of the currently played voice clip.

```nani
; Given a voice is being played, stop it.
@stopVoice
```

## style

Permanently applies [text styles](/guide/text-printers#text-styles) to the contents of a text printer.

::: info NOTE
You can also use rich text tags inside text messages to apply the styles selectively.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">textStyles</span> | string list | Text formatting tags to apply. Angle brackets should be omitted, eg use `b` for `<b>` and `size=100` for `<size=100>`. Use `default` keyword to reset the style. |
| printer | string | ID of the printer actor to use. Will use a default one when not provided. |

</div>

```nani
; Print first two sentences in bold red text with 45px size,
; then reset the style and print the last sentence using default style.
@style color=#ff0000,b,size=45
Lorem ipsum dolor sit amet.
Cras ut nisi eget ex viverra egestas in nec magna.
@style default
Consectetur adipiscing elit.

; Print starting part of the sentence normally, but the last one in bold.
Lorem ipsum sit amet. <b>Consectetur adipiscing elit.</b>
```

## sun

Spawns particle system simulating [sun shafts](/guide/special-effects.html#sun-shafts) aka god rays.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| power | decimal | The intensity of the rays (opacity), in 0.0 to 1.0 range; default is 0.85. Set to 0 to disable (de-spawn) the effect. |
| time | decimal | The particle system will gradually grow the spawn rate to the target level over the specified time, in seconds. |
| pos | decimal list | Position (relative to the scene borders, in percents) to set for the spawned effect game object. Position is described as follows: `0,0` is the bottom left, `50,50` is the center and `100,100` is the top right corner of the scene. Use Z-component (third member, eg `,,10`) to move (sort) by depth while in ortho mode. |
| position | decimal list | Position (in world space) to set for the spawned effect game object. |
| rotation | decimal list | Rotation to set for the spawned effect game object. |
| scale | decimal list | Scale to set for the spawned effect game object. |

</div>

```nani
; Start intensive sunshine over 10 seconds.
@sun power:1 time:10
; Stop the sunshine over 30 seconds.
@sun power:0 time:30
```

## title

Resets engine state and shows `ITitleUI` UI (main menu).

```nani
; Exit to title UI, no matter which script is playing.
@title
```

## toast

Shows a UI for general-purpose self-hiding popup notification (aka "toast") with the provided text and (optionally) appearance and duration. The UI is automatically hidden after the specified (or default) duration.

::: info NOTE
Appearance name is the name of a game object with `Toast Appearance` component inside the `ToastUI` UI prefab (case-insensitive).
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID">text</span> | string | The text content to set for the toast. |
| appearance | string | Appearance variant (game object name) of the toast. When not specified, will use default appearance set in Toast UI prefab. |
| time | decimal | Seconds to wait before hiding the toast. When not specified, will use duration set by default in Toast UI prefab. |

</div>

```nani
; Shows a default toast with `Hello World!` content.
@toast "Hello World!"

; Shows a toast with a `warning` appearance.
@toast "You're in danger!" appearance:warning

; The toast will disappear in one second.
@toast "I'll disappear in 1 second." time:1
```

## unloadScene

Unloads a [Unity scene](https://docs.unity3d.com/Manual/CreatingScenes.html) with the provided name. Don't forget to add the required scenes to the [build settings](https://docs.unity3d.com/Manual/BuildSettings.html) to make them available for loading. Be aware, that only scenes loaded additively can be then unloaded (at least one scene should always remain loaded).

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">sceneName</span> | string | Name of the scene to unload. |

</div>

```nani
; Load scene `TestScene2` in additive mode and then unload it.
@loadScene TestScene2 additive:true
@unloadScene TestScene2
```

## unlock

Sets an [unlockable item](/guide/unlockable-items) with the provided ID to `unlocked` state.

::: info NOTE
The unlocked state of the items is stored in [global scope](/guide/state-management#global-state).<br /> In case item with the provided ID is not registered in the global state map, the corresponding record will automatically be added.
:::

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">id</span> | string | ID of the unlockable item. Use `*` to unlock all the registered unlockable items. |

</div>

```nani
; Unlocks an unlockable CG record with ID `FightScene1`.
@unlock CG/FightScene1
```

## voice

Plays a voice clip at the provided path.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">voicePath</span> | string | Path to the voice clip to play. |
| volume | decimal | Volume of the playback. |
| group | string | Audio mixer [group path](https://docs.unity3d.com/ScriptReference/Audio.AudioMixer.FindMatchingGroups) that should be used when playing the audio. |
| authorId | string | ID of the character actor this voice belongs to. When provided and [per-author volume](/guide/voicing#author-volume) is used, volume will be adjusted accordingly. |

</div>

```nani
; Given a `Rawr` voice resource is available, play it.
@voice Rawr
```

## wait

Holds script execution until the specified wait condition.

<div class="config-table">

| Parameter | Type | Description |
| --- | --- | --- |
| <span class="command-param-nameless command-param-required" title="Nameless parameter: value should be provided after the command identifier without specifying parameter ID  Required parameter: parameter should always be specified">waitMode</span> | string | Wait conditions:<br /> - `i` user press continue or skip input key;<br /> - `0.0` timer (seconds);<br /> - `i0.0` timer, that is skip-able by continue or skip input keys. |
| do | string list | Script commands to execute when the wait is over. Escape commas inside list values to prevent them being treated as delimiters. |

</div>

```nani
; Thunder SFX will play 0.5 seconds after shake background effect finishes.
@spawn ShakeBackground
@wait 0.5
@sfx Thunder

; Print first 2 words, then wait for input before printing the rest.
Lorem ipsum[wait i] dolor sit amet.
; You can also use the following shortcut (@i command) for this wait mode.
Lorem ipsum[i] dolor sit amet.

; Start looped SFX, print message and wait for a skippable 5 seconds delay,
; then stop the SFX.
@sfx Noise loop:true
Jeez, what a disgusting noise. Shut it down![wait i5][skipInput]
@stopSfx Noise

; The text is printed without delay, as the `wait` command is not awaited.
; The thunder effects are played after a random delay of 3 to 8 seconds.
@wait {Random(3,8)} do:"@sfx Thunder, @shake Camera" wait:false
The thunder might go off any second...
```


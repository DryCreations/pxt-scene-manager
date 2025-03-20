//% weight=100 color=#6d5ba4 icon="\uf24d" block="Scene Manager"
//% groups="['Scene Management', 'Scene Lifecycle', 'Game Loop', 'Controller', 'Sprites', 'Info', 'Multiplayer']"
namespace sceneManager {
    interface SceneData {
        name: string;
    }

    let scenes: { [key: string]: SceneData } = {};
    let currentSceneId: string = null;

    let setupHandlers: { [key: string]: (() => void)[] } = {};
    let cleanupHandlers: { [key: string]: (() => void)[] } = {};

    function ensureSceneExists(name: string): void {
        if (!scenes[name]) {
            scenes[name] = {
                name: name
            };
        }
    }

    /**
     * Check if a scene with the given name exists
     * @param name The name of the scene
     */
    //% blockId=sceneManagerSceneExists
    //% block="scene named $name exists"
    //% name.defl="Main"
    //% weight=200
    //% group="Scene Management"
    export function sceneExists(name: string): boolean {
        return !!scenes[name];
    }

    /**
     * Transition to the scene with the given name
     * @param name The name of the scene
     */
    //% blockId=sceneManagerTransitionTo
    //% block="transition to scene named $name"
    //% name.defl="Main"
    //% weight=190
    //% group="Scene Management"
    export function transitionTo(name: string): void {
        ensureSceneExists(name);

        if (currentSceneId && cleanupHandlers[currentSceneId]) {
            const handlers = cleanupHandlers[currentSceneId];
            for (const handler of handlers) {
                handler();
            }
        }

        currentSceneId = name;

        if (setupHandlers[currentSceneId]) {
            const handlers = setupHandlers[currentSceneId];
            for (const handler of handlers) {
                handler();
            }
        }
    }

    /**
     * Get the name of the current scene
     */
    //% blockId=sceneManagerGetCurrentScene
    //% block="current scene name"
    //% weight=180
    //% group="Scene Management"
    export function getCurrentSceneName(): string {
        return currentSceneId;
    }

    /**
     * Run this code when entering the scene
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneSetup
    //% block="on scene named $sceneName setup" 
    //% sceneName.defl="Main"
    //% weight=170
    //% blockAllowMultiple=true
    //% group="Scene Lifecycle"
    export function onSceneSetup(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        if (!setupHandlers[sceneName]) {
            setupHandlers[sceneName] = [];
        }
        setupHandlers[sceneName].push(handler);
    }

    /**
     * Run this code when leaving the scene
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneCleanup
    //% block="on scene named $sceneName cleanup"
    //% sceneName.defl="Main"
    //% weight=160
    //% blockAllowMultiple=true
    //% group="Scene Lifecycle"
    export function onSceneCleanup(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        if (!cleanupHandlers[sceneName]) {
            cleanupHandlers[sceneName] = [];
        }
        cleanupHandlers[sceneName].push(handler);
    }

    /**
     * Run this code on each game update while the scene is active
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneUpdate
    //% block="on scene named $sceneName update"
    //% sceneName.defl="Main"
    //% weight=150
    //% blockAllowMultiple=true
    //% group="Game Loop"
    export function onSceneUpdate(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        game.onUpdate(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code repeatedly while the scene is active
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneForever
    //% block="on scene named $sceneName forever"
    //% sceneName.defl="Main"
    //% weight=140
    //% blockAllowMultiple=true
    //% group="Game Loop"
    export function onSceneForever(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        forever(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code periodically while the scene is active
     * @param sceneName The name of the scene
     * @param ms The interval in milliseconds
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneUpdateInterval
    //% block="on scene named $sceneName every $ms ms"
    //% sceneName.defl="Main"
    //% ms.defl=500
    //% weight=130
    //% blockAllowMultiple=true
    //% group="Game Loop"
    export function onSceneUpdateInterval(sceneName: string, ms: number, handler: () => void): void {
        ensureSceneExists(sceneName);

        game.onUpdateInterval(ms, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a controller button event occurs while the scene is active
     * @param sceneName The name of the scene
     * @param btn The button to monitor
     * @param event The button event type
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneButtonEvent
    //% block="on scene named $sceneName $btn $event"
    //% sceneName.defl="Main"
    //% btn.fieldEditor="gridpicker"
    //% btn.fieldOptions.columns=4
    //% btn.fieldOptions.tooltips="false"
    //% event.fieldEditor="gridpicker"
    //% event.fieldOptions.columns=3
    //% event.fieldOptions.tooltips="false"
    //% weight=120
    //% blockAllowMultiple=true
    //% group="Controller"
    export function onSceneButtonEvent(sceneName: string, btn: controller.Button, event: ControllerButtonEvent, handler: () => void): void {
        ensureSceneExists(sceneName);

        btn.addEventListener(event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when sprites of these kinds overlap while the scene is active
     * @param sceneName The name of the scene
     * @param spriteKind The kind of the first sprite
     * @param otherKind The kind of the other sprite
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneOverlap
    //% block="on scene named $sceneName sprite $spriteKind overlaps $otherKind"
    //% sceneName.defl="Main"
    //% weight=110
    //% blockAllowMultiple=true
    //% spriteKind.shadow=spritekind
    //% otherKind.shadow=spritekind
    //% group="Sprites"
    export function onSceneOverlap(sceneName: string, spriteKind: number, otherKind: number, handler: (sprite: Sprite, otherSprite: Sprite) => void): void {
        ensureSceneExists(sceneName);

        sprites.onOverlap(spriteKind, otherKind, (sprite: Sprite, otherSprite: Sprite) => {
            if (currentSceneId === sceneName) {
                handler(sprite, otherSprite);
            }
        });
    }

    /**
     * Run this code when a sprite of this kind is destroyed while the scene is active
     * @param sceneName The name of the scene
     * @param spriteKind The kind of the sprite
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneSpriteDestroyed
    //% block="on scene named $sceneName sprite $spriteKind destroyed"
    //% sceneName.defl="Main"
    //% weight=100
    //% blockAllowMultiple=true
    //% spriteKind.shadow=spritekind
    //% group="Sprites"
    export function onSceneSpriteDestroyed(sceneName: string, spriteKind: number, handler: (sprite: Sprite) => void): void {
        ensureSceneExists(sceneName);

        sprites.onDestroyed(spriteKind, (sprite: Sprite) => {
            if (currentSceneId === sceneName) {
                handler(sprite);
            }
        });
    }

    /**
     * Run this code when a sprite of this kind hits a wall while the scene is active
     * @param sceneName The name of the scene
     * @param spriteKind The kind of the sprite
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneHitWall
    //% block="on scene named $sceneName sprite $spriteKind hit wall"
    //% sceneName.defl="Main"
    //% weight=90
    //% blockAllowMultiple=true
    //% spriteKind.shadow=spritekind
    //% group="Sprites"
    export function onSceneHitWall(sceneName: string, spriteKind: number, handler: (sprite: Sprite) => void): void {
        ensureSceneExists(sceneName);

        scene.onHitWall(spriteKind, (sprite: Sprite) => {
            if (currentSceneId === sceneName) {
                handler(sprite);
            }
        });
    }

    /**
     * Run this code when life reaches zero while the scene is active
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneLifeZero
    //% block="on scene named $sceneName life zero"
    //% sceneName.defl="Main"
    //% weight=80
    //% blockAllowMultiple=true
    //% group="Info"
    export function onSceneLifeZero(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        info.onLifeZero(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when countdown reaches zero while the scene is active
     * @param sceneName The name of the scene
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneCountdownEnd
    //% block="on scene named $sceneName countdown end"
    //% sceneName.defl="Main"
    //% weight=70
    //% blockAllowMultiple=true
    //% group="Info"
    export function onSceneCountdownEnd(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);

        info.onCountdownEnd(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when score reaches the given value while the scene is active
     * @param sceneName The name of the scene
     * @param score The score value to monitor
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneScoreChange
    //% block="on scene named $sceneName score $score"
    //% sceneName.defl="Main"
    //% score.defl=100
    //% weight=60
    //% blockAllowMultiple=true
    //% group="Info"
    export function onSceneScoreChange(sceneName: string, score: number, handler: () => void): void {
        ensureSceneExists(sceneName);

        info.onScore(score, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a specific player's button event occurs while the scene is active
     * @param sceneName The name of the scene
     * @param player The player to monitor
     * @param btn The button to monitor
     * @param event The button event type
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerButtonEvent
    //% block="on scene named $sceneName player $player $btn $event"
    //% sceneName.defl="Main"
    //% player.shadow=multiplayer_player_picker
    //% btn.fieldEditor="gridpicker"
    //% btn.fieldOptions.columns=4
    //% btn.fieldOptions.tooltips="false"
    //% event.fieldEditor="gridpicker"
    //% event.fieldOptions.columns=3
    //% event.fieldOptions.tooltips="false"
    //% weight=50
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerButtonEvent(sceneName: string, player: controller.Controller, btn: ControllerButton, event: ControllerButtonEvent, handler: () => void): void {
        ensureSceneExists(sceneName);

        player.onButtonEvent(btn, event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a controller gets connected or disconnected while the scene is active
     * @param sceneName The name of the scene
     * @param player The player to monitor
     * @param state The controller event type
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneControllerEvent
    //% block="on scene named $sceneName when player $player $state"
    //% sceneName.defl="Main"
    //% player.shadow=multiplayer_player_picker
    //% state.shadow=controller_event_value_picker
    //% weight=40
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onSceneControllerEvent(sceneName: string, player: controller.Controller, state: ControllerEvent, handler: () => void): void {
        ensureSceneExists(sceneName);

        player.onEvent(state, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a player's score reaches a value while the scene is active
     * @param sceneName The name of the scene
     * @param player The player to monitor
     * @param score The score value to monitor
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerScore
    //% block="on scene named $sceneName player $player score $score"
    //% sceneName.defl="Main"
    //% player.shadow=multiplayer_player_picker
    //% score.defl=100
    //% weight=30
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerScore(sceneName: string, player: info.PlayerInfo, score: number, handler: () => void): void {
        ensureSceneExists(sceneName);

        player.onScore(score, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a player's life reaches zero while the scene is active
     * @param sceneName The name of the scene
     * @param player The player to monitor
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerLifeZero
    //% block="on scene named $sceneName player $player life zero"
    //% sceneName.defl="Main"
    //% player.shadow=multiplayer_player_picker
    //% weight=20
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerLifeZero(sceneName: string, player: info.PlayerInfo, handler: () => void): void {
        ensureSceneExists(sceneName);

        player.onLifeZero(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }
}
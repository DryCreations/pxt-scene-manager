//% weight=100 color=#0fbc11 icon="\uf1b2" block="Scene Manager"
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
     */
    //% blockId=sceneManagerSceneExists
    //% block="scene named $name exists"
    //% name.defl="Main"
    //% group="Scene Management"
    export function sceneExists(name: string): boolean {
        return !!scenes[name];
    }

    /**
     * Transition to the scene with the given name
     */
    //% blockId=sceneManagerTransitionTo
    //% block="transition to scene named $name"
    //% name.defl="Main"
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
    //% group="Scene Management"
    export function getCurrentSceneName(): string {
        return currentSceneId;
    }

    /**
     * Run this code when entering the scene
     */
    //% blockId=sceneManagerOnSceneSetup
    //% block="on scene named $sceneName setup" 
    //% sceneName.defl="Main"
    //% weight=95
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
     */
    //% blockId=sceneManagerOnSceneCleanup
    //% block="on scene named $sceneName cleanup"
    //% sceneName.defl="Main"
    //% weight=90
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
     */
    //% blockId=sceneManagerOnSceneUpdate
    //% block="on scene named $sceneName update"
    //% sceneName.defl="Main"
    //% weight=80
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
     */
    //% blockId=sceneManagerOnSceneForever
    //% block="on scene named $sceneName forever"
    //% sceneName.defl="Main"
    //% weight=85
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
     */
    //% blockId=sceneManagerOnSceneUpdateInterval
    //% block="on scene named $sceneName every $ms ms"
    //% sceneName.defl="Main"
    //% ms.defl=500
    //% weight=75
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
    //% weight=70
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
     */
    //% blockId=sceneManagerOnSceneOverlap
    //% block="on scene named $sceneName sprite $spriteKind overlaps $otherKind"
    //% sceneName.defl="Main"
    //% weight=65
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
     */
    //% blockId=sceneManagerOnSceneSpriteDestroyed
    //% block="on scene named $sceneName sprite $spriteKind destroyed"
    //% sceneName.defl="Main"
    //% weight=64
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
     */
    //% blockId=sceneManagerOnSceneHitWall
    //% block="on scene named $sceneName sprite $spriteKind hit wall"
    //% sceneName.defl="Main"
    //% weight=63
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
     */
    //% blockId=sceneManagerOnSceneLifeZero
    //% block="on scene named $sceneName life zero"
    //% sceneName.defl="Main"
    //% weight=62
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
     */
    //% blockId=sceneManagerOnSceneCountdownEnd
    //% block="on scene named $sceneName countdown end"
    //% sceneName.defl="Main"
    //% weight=61
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
     */
    //% blockId=sceneManagerOnScenePlayerButtonEvent
    //% block="on scene named $sceneName player $player $btn $event"
    //% sceneName.defl="Main"
    //% player.shadow=mp_controller_selector
    //% btn.fieldEditor="gridpicker"
    //% btn.fieldOptions.columns=4
    //% btn.fieldOptions.tooltips="false"
    //% event.fieldEditor="gridpicker"
    //% event.fieldOptions.columns=3
    //% event.fieldOptions.tooltips="false"
    //% weight=59
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerButtonEvent(sceneName: string, player: controller.Controller, btn: controller.Button, event: ControllerButtonEvent, handler: () => void): void {
        ensureSceneExists(sceneName);
        
        player.onButtonEvent(btn, event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a multiplayer controller event occurs while the scene is active
     */
    //% blockId=sceneManagerOnSceneControllerEvent
    //% block="on scene named $sceneName controller $player connected $connected"
    //% sceneName.defl="Main"
    //% player.shadow=mp_controller_selector
    //% weight=58
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onSceneControllerEvent(sceneName: string, player: controller.Controller, connected: boolean, handler: () => void): void {
        ensureSceneExists(sceneName);
        
        mp.onControllerEvent(player, connected, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a player's score changes while the scene is active
     */
    //% blockId=sceneManagerOnSceneScoreMP
    //% block="on scene named $sceneName player $player score $score"
    //% sceneName.defl="Main"
    //% player.shadow=mp_controller_selector
    //% score.defl=100
    //% weight=57
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onSceneScoreMP(sceneName: string, player: controller.Controller, score: number, handler: () => void): void {
        ensureSceneExists(sceneName);
        
        mp.onScore(player, score, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when shared life counter reaches zero while the scene is active
     */
    //% blockId=sceneManagerOnSceneSharedLifeZero
    //% block="on scene named $sceneName shared life zero"
    //% sceneName.defl="Main"
    //% weight=56
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onSceneSharedLifeZero(sceneName: string, handler: () => void): void {
        ensureSceneExists(sceneName);
        
        mp.onSharedLifeZero(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }
    
    /**
     * Run this code when a player dies (runs out of lives) while the scene is active
     */
    //% blockId=sceneManagerOnScenePlayerDied
    //% block="on scene named $sceneName player died"
    //% sceneName.defl="Main"
    //% weight=55
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerDied(sceneName: string, handler: (player: number) => void): void {
        ensureSceneExists(sceneName);
        
        mp.onPlayerDied((player: number) => {
            if (currentSceneId === sceneName) {
                handler(player);
            }
        });
    }
}
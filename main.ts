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
    export function sceneExists(name: string): boolean {
        return !!scenes[name];
    }

    /**
     * Transition to the scene with the given name
     */
    //% blockId=sceneManagerTransitionTo
    //% block="transition to scene named $name"
    //% name.defl="Main"
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
    export function onSceneButtonEvent(sceneName: string, btn: controller.Button, event: ControllerButtonEvent, handler: () => void): void {
        ensureSceneExists(sceneName);
        
        btn.addEventListener(event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }
}
//% weight=100 color=#0fbc11 icon="\uf1b2" block="Scene Manager"
namespace sceneManager {
    // Screen data store - simplified to just track screen names
    interface ScreenData {
        name: string;
    }
    
    // Store screens in a simple object dictionary
    let screens: { [key: string]: ScreenData } = {};
    let currentScreenId: string = null;
    
    // Store handlers by screen ID
    let setupHandlers: { [key: string]: (() => void)[] } = {};
    let cleanupHandlers: { [key: string]: (() => void)[] } = {};

    // Helper function to ensure a screen exists
    function ensureScreenExists(name: string): void {
        if (!screens[name]) {
            screens[name] = {
                name: name
            };
        }
    }

    /**
     * Check if a screen with the given name exists
     * @param name The name of the screen to check
     */
    //% blockId=sceneManagerScreenExists
    //% block="screen named $name exists"
    //% name.defl="Main"
    export function screenExists(name: string): boolean {
        return !!screens[name];
    }

    /**
     * Transition to the screen with the given name
     * @param name The name of the screen to transition to
     */
    //% blockId=sceneManagerTransitionTo
    //% block="transition to screen named $name"
    //% name.defl="Main"
    export function transitionTo(name: string): void {
        // Create the screen if it doesn't exist
        ensureScreenExists(name);
        
        // Run cleanup on current screen if it exists
        if (currentScreenId && cleanupHandlers[currentScreenId]) {
            const handlers = cleanupHandlers[currentScreenId];
            for (const handler of handlers) {
                handler();
            }
        }
        
        // Set the new current screen
        currentScreenId = name;
        
        // Run setup on the new screen
        if (setupHandlers[currentScreenId]) {
            const handlers = setupHandlers[currentScreenId];
            for (const handler of handlers) {
                handler();
            }
        }
    }

    /**
     * Get the name of the current screen
     */
    //% blockId=sceneManagerGetCurrentScreen
    //% block="current screen name"
    export function getCurrentScreenName(): string {
        return currentScreenId;
    }

    /**
     * Run this code when entering the screen with the given name
     * @param screenName The name of the screen to set up
     */
    //% blockId=sceneManagerOnScreenSetup
    //% block="on screen named $screenName setup" 
    //% screenName.defl="Main"
    //% weight=95
    //% blockAllowMultiple=true
    export function onScreenSetup(screenName: string, handler: () => void): void {
        ensureScreenExists(screenName);
        
        if (!setupHandlers[screenName]) {
            setupHandlers[screenName] = [];
        }
        setupHandlers[screenName].push(handler);
    }

    /**
     * Run this code when leaving the screen with the given name
     * @param screenName The name of the screen to clean up
     */
    //% blockId=sceneManagerOnScreenCleanup
    //% block="on screen named $screenName cleanup"
    //% screenName.defl="Main"
    //% weight=90
    //% blockAllowMultiple=true
    export function onScreenCleanup(screenName: string, handler: () => void): void {
        ensureScreenExists(screenName);
        
        if (!cleanupHandlers[screenName]) {
            cleanupHandlers[screenName] = [];
        }
        cleanupHandlers[screenName].push(handler);
    }
}
//% weight=100 color=#6d5ba4 icon="\uf24d" block="Scene Manager"
//% groups=["Scene Management","Scene Lifecycle","Game Loop","Controller","Sprites","Info","Multiplayer"]
namespace sceneManager {
    interface SceneData {
        name: string;
    }

    /**
     * Player numbers for multiplayer functionality
     */
    export enum PlayerNumber {
        //% block="player 1"
        One = 1,
        //% block="player 2"
        Two = 2,
        //% block="player 3"
        Three = 3,
        //% block="player 4"
        Four = 4
    }

    /**
     * Controller connection events
     */
    export enum ControllerEventType {
        //% block="connected"
        Connected = 0,
        //% block="disconnected"
        Disconnected = 1
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
     * @param playerNum The player number (1-4)
     * @param btn The button to monitor
     * @param event The button event type
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerButtonEvent
    //% block="on scene named $sceneName player $playerNum $btn $event"
    //% sceneName.defl="Main"
    //% playerNum.shadow=sceneManagerPlayerNumber
    //% btn.fieldEditor="gridpicker"
    //% btn.fieldOptions.columns=4
    //% btn.fieldOptions.tooltips="false"
    //% event.fieldEditor="gridpicker"
    //% event.fieldOptions.columns=3
    //% event.fieldOptions.tooltips="false"
    //% weight=50
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerButtonEvent(sceneName: string, playerNum: PlayerNumber, btn: ControllerButton, event: ControllerButtonEvent, handler: () => void): void {
        ensureSceneExists(sceneName);

        const player = playerNum === PlayerNumber.One ? controller.player1 :
            playerNum === PlayerNumber.Two ? controller.player2 :
                playerNum === PlayerNumber.Three ? controller.player3 :
                    controller.player4;

        player.onButtonEvent(btn, event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a controller gets connected or disconnected while the scene is active
     * @param sceneName The name of the scene
     * @param playerNum The player number (1-4)
     * @param eventType The connection event (connected or disconnected)
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnSceneControllerEvent
    //% block="on scene named $sceneName when $playerNum $eventType"
    //% sceneName.defl="Main"
    //% playerNum.shadow=sceneManagerPlayerNumber
    //% eventType.shadow=sceneManagerControllerEventType
    //% weight=40
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onSceneControllerEvent(sceneName: string, playerNum: PlayerNumber, eventType: ControllerEventType, handler: () => void): void {
        ensureSceneExists(sceneName);

        const player = playerNum === PlayerNumber.One ? controller.player1 :
            playerNum === PlayerNumber.Two ? controller.player2 :
                playerNum === PlayerNumber.Three ? controller.player3 :
                    controller.player4;

        const event = eventType === ControllerEventType.Connected ? ControllerEvent.Connected : ControllerEvent.Disconnected;

        player.onEvent(event, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a player's score reaches a value while the scene is active
     * @param sceneName The name of the scene
     * @param playerNum The player number (1-4)
     * @param score The score value to monitor
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerScore
    //% block="on scene named $sceneName $playerNum score $score"
    //% sceneName.defl="Main"
    //% playerNum.shadow=sceneManagerPlayerNumber
    //% score.defl=100
    //% weight=30
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerScore(sceneName: string, playerNum: PlayerNumber, score: number, handler: () => void): void {
        ensureSceneExists(sceneName);

        const playerInfo = playerNum === PlayerNumber.One ? info.player1 :
            playerNum === PlayerNumber.Two ? info.player2 :
                playerNum === PlayerNumber.Three ? info.player3 :
                    info.player4;

        playerInfo.onScore(score, () => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Run this code when a player's life reaches zero while the scene is active
     * @param sceneName The name of the scene
     * @param playerNum The player number (1-4)
     * @param handler The code to run
     */
    //% blockId=sceneManagerOnScenePlayerLifeZero
    //% block="on scene named $sceneName $playerNum life zero"
    //% sceneName.defl="Main"
    //% playerNum.shadow=sceneManagerPlayerNumber
    //% weight=20
    //% blockAllowMultiple=true
    //% group="Multiplayer"
    export function onScenePlayerLifeZero(sceneName: string, playerNum: PlayerNumber, handler: () => void): void {
        ensureSceneExists(sceneName);

        const playerInfo = playerNum === PlayerNumber.One ? info.player1 :
            playerNum === PlayerNumber.Two ? info.player2 :
                playerNum === PlayerNumber.Three ? info.player3 :
                    info.player4;

        playerInfo.onLifeZero(() => {
            if (currentSceneId === sceneName) {
                handler();
            }
        });
    }

    /**
     * Creates a shadow block for player number selection
     */
    //% blockId=sceneManagerPlayerNumber
    //% block="$playerNumber"
    //% blockHidden=true
    //% shim=TD_ID
    export function _playerNumber(playerNumber: PlayerNumber): PlayerNumber {
        return playerNumber;
    }

    /**
     * Creates a shadow block for controller event type selection
     */
    //% blockId=sceneManagerControllerEventType
    //% block="$eventType"
    //% blockHidden=true
    //% shim=TD_ID
    export function _controllerEventType(eventType: ControllerEventType): ControllerEventType {
        return eventType;
    }
}
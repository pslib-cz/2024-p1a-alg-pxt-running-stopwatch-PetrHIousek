enum State {
    ready,
    running,
    finish
}
radio.setTransmitPower(7)
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    
    radio.sendString("resetuj")
    reset()
})

radio.onReceivedString(function(receivedString: string) {
    if (receivedString == "resetuj2") {
        reset()
    }
})

input.onButtonPressed(Button.A, function () {
    Sensors.SetLightLevel()
})

radio.setGroup(69)
let state: State = State.ready;
let startTimestamp = 0
reset()
function reset() {
    basic.pause(100)
    Sensors.SetLightLevel()
    basic.showNumber(1)
    state = State.ready
    startTimestamp = 0
}

radio.onReceivedNumber(function (receivedNumber: number) {
    if (receivedNumber == 0) {
        if (state === State.ready) {
            state = State.running
            startTimestamp = input.runningTime()
            music.playTone(450, 250)
            basic.showNumber(2)
        }
    }
})

Sensors.OnLightDrop(function () {
    if (state === State.running) {
        let elapsedTime = input.runningTime() - startTimestamp
        radio.sendValue("elapsedT", elapsedTime)
        state = State.finish
        music.playTone(300, 250)
        basic.showNumber(elapsedTime)
        input.onButtonPressed(Button.B, function () {
            basic.showNumber(elapsedTime)
        })
    }
})

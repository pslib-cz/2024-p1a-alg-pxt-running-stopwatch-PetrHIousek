enum State {
    ready,
    running,
    finish
}
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    control.reset()
})
input.onButtonPressed(Button.A, function () {
    Sensors.SetLightLevel()
})
radio.setGroup(69)
let state: State = State.ready;
let startTimestamp = 0
basic.pause(100)
Sensors.SetLightLevel()

radio.onReceivedNumber(function (receivedNumber: number) {
    if (receivedNumber == 0) {
        if (state === State.ready) {
            state = State.running
            startTimestamp = input.runningTime()
        }
    }
})

Sensors.OnLightDrop(function () {
    if (state === State.running) {
        let elapsedTime = input.runningTime() - startTimestamp
        radio.sendValue("elapsedT", elapsedTime)
        state = State.finish
        basic.showNumber(elapsedTime)
    }
})

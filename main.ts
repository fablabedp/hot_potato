function networkSendToRandom (value: number) {
    target = control.deviceSerialNumber()
    while (target == control.deviceSerialNumber()) {
        target = ids[randint(0, ids.length - 1)]
    }
    radio.sendValue(convertToText(target), value)
}
function networkRecieve (name: string, value: number) {
    if (name == "id") {
        if (ids.indexOf(value) < 0) {
            ids.push(value)
            basic.showNumber(ids.length)
        }
        radio.sendValue("count", ids.length)
    } else if (name == "count") {
        if (value < ids.length) {
            for (let id of ids) {
                radio.sendValue("id", id)
            }
        }
    } else if (name == convertToText(control.deviceSerialNumber()).substr(0, 8)) {
        getBatata(value)
    } else {
        basic.clearScreen()
    }
}
function getBatata (value: number) {
    basic.showIcon(IconNames.Diamond)
    batata = value
    setTom()
}
input.onButtonPressed(Button.AB, function () {
    batata = 100
    setTom()
    basic.showIcon(IconNames.Diamond)
})
function networkInit () {
    ids = []
    ids.push(control.deviceSerialNumber())
    basic.showNumber(ids.length)
    radio.sendValue("id", control.deviceSerialNumber())
    basic.pause(1000)
    radio.sendValue("count", 1)
}
input.onGesture(Gesture.Shake, function () {
    if (batata > 0) {
        networkSendToRandom(batata)
        batata = -1
        basic.clearScreen()
    }
})
radio.onReceivedValue(function (name, value) {
    networkRecieve(name, value)
})
function setTom () {
    tom = 659 - batata * 5
}
let tom = 0
let ids: number[] = []
let target = 0
let batata = 0
radio.setGroup(1)
networkInit()
batata = -1
music.setTempo(500)
setTom()
basic.forever(function () {
    if (batata > 0) {
        batata += -1
        setTom()
        music.playTone(tom, music.beat(BeatFraction.Whole))
    }
    if (batata == 0) {
        basic.showIcon(IconNames.Sad)
        music.playMelody("C5 A G E C - - - ", 500)
        batata = -1
    }
})

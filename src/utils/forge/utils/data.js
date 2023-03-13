export const modelObj = {
    color: new THREE.Vector4(255 / 255, 165 / 255, 2 / 255, 1),
    lightColorOn: new THREE.Vector4(46 / 255, 204 / 255, 113 / 255, 1),
    lightColorOff: new THREE.Vector4(236 / 255, 240 / 255, 241 / 255, 1),
    shotLift: ['Lift-15', 'Lift-16', 'Lift-17', 'Lift-18'],
    rotateArray: ['AHU(X)', 'PF', 'SF', '诱导', 'BF', 'AHU-', '热回收'],
    rotateObj: {
        'AHU(X)': [
            {dbId: 24, right: false, axis: {x: 0, y: 1, z: 0}}
        ],
        'PF': [
            {dbId: 14, right: true, axis: {x: 0, y: 1, z: 0}}
        ],
        'SF': [
            {dbId: 14, right: true, axis: {x: 0, y: 1, z: 0}}
        ],
        '诱导': [
            {dbId: 14, right: true, axis: {x: 0, y: 1, z: 0}}
        ],
        'BF': [
            {dbId: 14, right: true, axis: {x: 0, y: 1, z: 0}}
        ],
        'AHU-': [
            {dbId: 50, right: false, axis: {x: 0, y: 1, z: 0}}
        ],
        '热回收': [
            {dbId: 17, right: false, axis: {x: 0, y: 1, z: 0}},
            {dbId: 21, right: true, axis: {x: 1, y: 0, z: 0}},
            {dbId: 10, right: true, axis: {x: 0, y: 1, z: 0}},
        ]
    },
    floorPos: {
        '15': 0,
        '14': -4286,
        '13': -8572,
        '12': -12858,
        '11': -17144,
        '10': -21430,
        '9': -25716,
        '8': -30002,
        '7': -34288,
        '6': -38574,
        '5': -42860,
        '4': -47146,
        '3': -51432,
        '2': -55718,
        '1': -60004,
    },
    liftSpeed: 200
}
export const modelLift = () => {
    const obj = {}
    let key = ''
    let value = ''
    for (let i = 1; i < 21; i++) {
        key = i < 10 ? "Lift-0" + i : "Lift-" + i;
        if (i === 17 || i === 18) {
            value = "L" + i + "VIP"
        } else {
            value = "L" + i
        }
        obj[key] = value
    }
    return obj
}
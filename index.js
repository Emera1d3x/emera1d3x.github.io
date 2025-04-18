const CODE_TEMPLATE = {
    setup: ["imlr", "islr"],
    loop: ["reader", "if1", "if2", "if3"],
    children: {
        if1: ["mrf", "mrl"],
        if2: ["mrf"],
        if3: ["mrl"]
    }
};
function normalize(id) {
    if (id.startsWith("mrf")) return "mrf";
    if (id.startsWith("mrl")) return "mrl";
    return id;
}
function checkCodeCorrectness() {
    const setupIds = Array.from(document.getElementById("setup").children).map(el => normalize(el.id));
    const loopEls = Array.from(document.getElementById("loop").children);
    // Check setup presence
    for (const id of CODE_TEMPLATE.setup) {
        if (!setupIds.includes(id)) return false;
    }
    // Check loop block ids
    const loopIds = loopEls.map(el => normalize(el.id));
    for (const id of CODE_TEMPLATE.loop) {
        if (!loopIds.includes(id)) return false;
    }
    // Check child blocks
    for (const block of loopEls) {
        const parentId = normalize(block.id);
        const expectedChildren = CODE_TEMPLATE.children[parentId] || [];
        const childIds = Array.from(block.children).map(el => normalize(el.id));
        for (const expected of expectedChildren) {
            if (!childIds.includes(expected)) return false;
        }
    }
    return true;
}
function updateCodeStatus() {
    const codeBox = document.getElementById("codeStatus");
    if (!codeBox) return;
    if (checkCodeCorrectness()) {
        codeBox.textContent = "✓ Copy Code";
        codeBox.className = "copyBox correct";
    } else {
        codeBox.textContent = "✗ Incorrect Code";
        codeBox.className = "copyBox incorrect";
    }
}
document.addEventListener("DOMContentLoaded", () => {
    updateCodeStatus();
    const setup = document.getElementById("setup");
    const loop = document.getElementById("loop");
    if (setup && loop) {
        const observer = new MutationObserver(updateCodeStatus);
        observer.observe(setup, { childList: true, subtree: true });
        observer.observe(loop, { childList: true, subtree: true });
    }
});
function handleCopyCode() {
    if (!checkCodeCorrectness()) return;

    const code = `
    #define IR_SENSOR_RIGHT 11  // Right IR sensor connected to pin 11
    #define IR_SENSOR_LEFT 12   // Left IR sensor connected to pin 12
    #define MOTOR_SPEED 50  // Base speed of the motors

    int rightMotorPinA = 7;   // Right motor direction control pin 1
    int rightMotorPinB = 8;   // Right motor direction control pin 2
    int leftMotorPinA = 9;    // Left motor direction control pin 1
    int leftMotorPinB = 10;   // Left motor direction control pin 2

    void setup()
    {
    TCCR0B = TCCR0B & B11111000 | B00000010;

    pinMode(rightMotorPinA, OUTPUT);
    pinMode(rightMotorPinB, OUTPUT);
    pinMode(leftMotorPinA, OUTPUT);
    pinMode(leftMotorPinB, OUTPUT);

    pinMode(IR_SENSOR_RIGHT, INPUT);
    pinMode(IR_SENSOR_LEFT, INPUT);

    rotateMotor(0, 0);
    }

    void loop()
    {
    int rightIRSensorValue = digitalRead(IR_SENSOR_RIGHT);
    int leftIRSensorValue = digitalRead(IR_SENSOR_LEFT);

    if (rightIRSensorValue == LOW && leftIRSensorValue == LOW) {
        rotateMotor(MOTOR_SPEED, MOTOR_SPEED);
    } else if (rightIRSensorValue == HIGH && leftIRSensorValue == LOW) {
        rotateMotor(MOTOR_SPEED, 0);
    } else if (rightIRSensorValue == LOW && leftIRSensorValue == HIGH) {
        rotateMotor(0, MOTOR_SPEED);
    } else {
        rotateMotor(0, 0);
    }
    }

    void rotateMotor(int rightMotorSpeed, int leftMotorSpeed)
    {
    if (rightMotorSpeed < 0) {
        digitalWrite(rightMotorPinB, LOW);
        digitalWrite(rightMotorPinA, HIGH);
    } else if (rightMotorSpeed > 0) {
        digitalWrite(rightMotorPinB, HIGH);
        digitalWrite(rightMotorPinA, LOW);
    } else {
        digitalWrite(rightMotorPinB, LOW);
        digitalWrite(rightMotorPinA, LOW);
    }

    if (leftMotorSpeed > 0) {
        digitalWrite(leftMotorPinA, LOW);
        digitalWrite(leftMotorPinB, HIGH);
    } else if (leftMotorSpeed < 0) {
        digitalWrite(leftMotorPinA, HIGH);
        digitalWrite(leftMotorPinB, LOW);
    } else {
        digitalWrite(leftMotorPinA, LOW);
        digitalWrite(leftMotorPinB, LOW);
    }
    }
    `
.trim();
    navigator.clipboard.writeText(code);
}

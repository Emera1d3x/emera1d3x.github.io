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
// IR sensors
#define IR_SENSOR_RIGHT 11  
#define IR_SENSOR_LEFT  12  

// MOTOR_SPEED: what fraction of each cycle the motor is ON  
//   0 -> always off, 100 -> always on  
#define MOTOR_SPEED   60    // percent duty cycle (try 20..80)

// PWM_PERIOD: length of each on/off cycle in milliseconds  
//   smaller = smoother but more CPU blocking  
#define PWM_PERIOD    20    // ms

// motor driver pins
int rightMotorPin1 = 7;
int rightMotorPin2 = 8;
int leftMotorPin1  = 9;
int leftMotorPin2  = 10;

void setup() {
  pinMode(rightMotorPin1, OUTPUT);
  pinMode(rightMotorPin2, OUTPUT);
  pinMode(leftMotorPin1,  OUTPUT);
  pinMode(leftMotorPin2,  OUTPUT);

  pinMode(IR_SENSOR_RIGHT, INPUT);
  pinMode(IR_SENSOR_LEFT,  INPUT);

  // ensure motors are stopped
  rotateMotor(0, 0);
}

void loop() {
  // read IRs
  bool obsR = digitalRead(IR_SENSOR_RIGHT);
  bool obsL = digitalRead(IR_SENSOR_LEFT);

  // decide drive direction flags (1 = forward, 0 = stop)
  int driveR = 0, driveL = 0;
  if (!obsR && !obsL) {
    // both clear → forward
    driveR = driveL = 1;
  }
  else if (obsR && !obsL) {
    // obstacle on right → turn left
    driveR = 1; driveL = 0;
  }
  else if (!obsR && obsL) {
    // obstacle on left → turn right
    driveR = 0; driveL = 1;
  }
  // else both blocked → driveR=driveL=0

  if (driveR || driveL) {
    // compute on/off times
    unsigned long onTime  = (MOTOR_SPEED * PWM_PERIOD) / 100;
    unsigned long offTime = PWM_PERIOD - onTime;

    // ON phase
    rotateMotor(driveR, driveL);
    delay(onTime);

    // OFF phase
    rotateMotor(0, 0);
    delay(offTime);
  }
  else {
    // fully stopped
    rotateMotor(0, 0);
    // you could add a small delay here to debounce sensors
  }
}

void rotateMotor(int rightOn, int leftOn) {
  // right motor
  if (rightOn) {
    digitalWrite(rightMotorPin2, HIGH);
    digitalWrite(rightMotorPin1, LOW);
  } else {
    digitalWrite(rightMotorPin2, LOW);
    digitalWrite(rightMotorPin1, LOW);
  }
  // left motor
  if (leftOn) {
    digitalWrite(leftMotorPin1, HIGH);
    digitalWrite(leftMotorPin2, LOW);
  } else {
    digitalWrite(leftMotorPin1, LOW);
    digitalWrite(leftMotorPin2, LOW);
  }
} `
.trim();
    navigator.clipboard.writeText(code);
}

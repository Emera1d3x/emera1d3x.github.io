document.addEventListener("DOMContentLoaded", () => {
    const checkbox1 = document.querySelector('.switch input');
    const checkbox2 = document.querySelector('.switch2 input');
    const numberText1 = document.querySelector('.numberInput1Text');
    const numberText2 = document.querySelector('.numberInput2Text');
    const functionBox = document.querySelector('.function-box-inner');
    const sidebar = document.querySelector('.functions');
    const outputPicture = document.querySelector('.output-picture');
    let lastFunction = null;
    let selectedFunction = 0;
    const updateState = () => {
        let isChecked1 = checkbox1.checked;
        let isChecked2 = checkbox2.checked;
        let currentState = false;

        if (selectedFunction === 1) { // AND
            currentState = isChecked1 && isChecked2;
        } else if (selectedFunction === 2) { // OR
            currentState = isChecked1 || isChecked2;
        } else if (selectedFunction === 3) { // NAND
            currentState = !(isChecked1 && isChecked2);
        } else if (selectedFunction === 4) { // NOR
            currentState = !(isChecked1 || isChecked2);
        } else if (selectedFunction === 5) { // XOR
            currentState = (isChecked1 && !isChecked2) || (!isChecked1 && isChecked2);
        }
        outputPicture.src = currentState ? "lightBulbOn.gif" : "lightBulbOff.png";
    };
    const updateDisplay = () => {
        numberText1.textContent = checkbox1.checked ? "1" : "0";
        numberText1.style.color = checkbox1.checked ? "#e98585" : "";
        numberText2.textContent = checkbox2.checked ? "1" : "0";
        numberText2.style.color = checkbox2.checked ? "#e98585" : "";
        updateState();
    };
    checkbox1.addEventListener('change', updateDisplay);
    checkbox2.addEventListener('change', updateDisplay);
    document.querySelectorAll('.functions > div').forEach(element => {
        element.setAttribute('draggable', true);
        element.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('functionId', element.className);
        });
    });
    functionBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        functionBox.style.backgroundColor = "#e98585";
    });
    functionBox.addEventListener('dragleave', () => {
        functionBox.style.backgroundColor = "";
    });
    functionBox.addEventListener('drop', (e) => {
        e.preventDefault();
        functionBox.style.backgroundColor = "";
        const functionClass = e.dataTransfer.getData('functionId');
        if (!functionClass) return;
        const draggedFunction = document.querySelector(`.${functionClass}`);
        if (!draggedFunction) return;
        if (lastFunction) {
            lastFunction.style.height = "11.2vh";
            lastFunction.style.width = "95%";
            sidebar.appendChild(lastFunction);
        }
        functionBox.innerHTML = "";
        functionBox.appendChild(draggedFunction);
        lastFunction = draggedFunction;
        draggedFunction.style.margin = "5px";
        draggedFunction.style.height = "100%";
        draggedFunction.style.width = "100%";
        draggedFunction.style.display = "flex";
        draggedFunction.style.alignItems = "center";
        draggedFunction.style.justifyContent = "center";
        switch (functionClass) {
            case "and":
                selectedFunction = 1;
                break;
            case "or":
                selectedFunction = 2;
                break;
            case "nand":
                selectedFunction = 3;
                break;
            case "nor":
                selectedFunction = 4;
                break;
            case "xor":
                selectedFunction = 5;
                break;
            default:
                selectedFunction = 0;
        }
        console.log("Selected function:", selectedFunction);
        updateState();
    });
});

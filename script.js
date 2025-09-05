// script.js

// Инициализация Blockly
let workspace;

// Функция для создания рабочей области
function initBlockly() {
    // Создаем Toolbox с категориями блоков
    const toolbox = {
        kind: "categoryToolbox",
        contents: [
            {
                kind: "category",
                name: "Ввод/вывод",
                colour: "#5b80a5",
                contents: [
                    {
                        kind: "block",
                        type: "controls_digital_write"
                    },
                    {
                        kind: "block",
                        type: "controls_digital_read"
                    },
                    {
                        kind: "block",
                        type: "controls_analog_write"
                    },
                    {
                        kind: "block",
                        type: "controls_analog_read"
                    }
                ]
            },
            {
                kind: "category",
                name: "Управление",
                colour: "#5b80a5",
                contents: [
                    {
                        kind: "block",
                        type: "controls_delay"
                    },
                    {
                        kind: "block",
                        type: "controls_if"
                    },
                    {
                        kind: "block",
                        type: "controls_whileUntil"
                    }
                ]
            },
            {
                kind: "category",
                name: "Математика",
                colour: "#5b80a5",
                contents: [
                    {
                        kind: "block",
                        type: "math_number"
                    },
                    {
                        kind: "block",
                        type: "math_arithmetic"
                    },
                    {
                        kind: "block",
                        type: "logic_compare"
                    }
                ]
            },
            {
                kind: "category",
                name: "Переменные",
                colour: "#5b80a5",
                custom: "VARIABLE"
            },
            {
                kind: "category",
                name: "Функции",
                colour: "#5b80a5",
                custom: "PROCEDURE"
            }
        ]
    };

    // Инициализируем рабочую область
    workspace = Blockly.inject('blocklyArea', {
        toolbox: toolbox,
        grid: {
            spacing: 20,
            length: 3,
            colour: '#ccc',
            snap: true
        },
        zoom: {
            controls: true,
            wheel: true,
            startScale: 1.0,
            maxScale: 3,
            minScale: 0.3,
            scaleSpeed: 1.2
        },
        trashcan: true,
        renderer: 'zelos'
    });

    // Добавляем пользовательские блоки
    addCustomBlocks();
    
    // Обновляем код при изменении блоков
    workspace.addChangeListener(updateCode);
}

// Добавление пользовательских блоков
function addCustomBlocks() {
    // Блок digitalWrite
    Blockly.Blocks['controls_digital_write'] = {
        init: function() {
            this.appendValueInput("VALUE")
                .setCheck("Number")
                .appendField("digitalWrite pin");
            this.appendDummyInput()
                .appendField("to");
            this.appendValueInput("STATE")
                .setCheck("Boolean");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Запись значения на цифровой пин");
            this.setHelpUrl("");
        }
    };

    // Блок digitalRead
    Blockly.Blocks['controls_digital_read'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("digitalRead pin");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Чтение значения с цифрового пина");
            this.setHelpUrl("");
        }
    };

    // Блок analogWrite
    Blockly.Blocks['controls_analog_write'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("analogWrite pin");
            this.appendValueInput("VALUE")
                .setCheck("Number")
                .appendField("to value");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Запись аналогового значения на пин");
            this.setHelpUrl("");
        }
    };

    // Блок analogRead
    Blockly.Blocks['controls_analog_read'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("analogRead pin");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Чтение аналогового значения с пина");
            this.setHelpUrl("");
        }
    };

    // Блок delay
    Blockly.Blocks['controls_delay'] = {
        init: function() {
            this.appendValueInput("DURATION")
                .setCheck("Number")
                .appendField("delay");
            this.appendDummyInput()
                .appendField("milliseconds");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Задержка выполнения программы");
            this.setHelpUrl("");
        }
    };

    // Блок if
    Blockly.Blocks['controls_if'] = {
        init: function() {
            this.appendValueInput("CONDITION")
                .setCheck("Boolean")
                .appendField("if");
            this.appendStatementInput("DO")
                .appendField("then");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Условное выполнение кода");
            this.setHelpUrl("");
        }
    };

    // Блок while
    Blockly.Blocks['controls_whileUntil'] = {
        init: function() {
            this.appendValueInput("CONDITION")
                .setCheck("Boolean")
                .appendField("while");
            this.appendStatementInput("DO")
                .appendField("do");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Цикл с условием");
            this.setHelpUrl("");
        }
    };

    // Генерация кода для пользовательских блоков
    Blockly.Arduino['controls_digital_write'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
        const state = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_ATOMIC);
        return `digitalWrite(${pin}, ${state});\n`;
    };

    Blockly.Arduino['controls_digital_read'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        return [`digitalRead(${pin})`, Blockly.Arduino.ORDER_NONE];
    };

    Blockly.Arduino['controls_analog_write'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
        return `analogWrite(${pin}, ${value});\n`;
    };

    Blockly.Arduino['controls_analog_read'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        return [`analogRead(${pin})`, Blockly.Arduino.ORDER_NONE];
    };

    Blockly.Arduino['controls_delay'] = function(block) {
        const duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_ATOMIC);
        return `delay(${duration});\n`;
    };

    Blockly.Arduino['controls_if'] = function(block) {
        const condition = Blockly.Arduino.valueToCode(block, 'CONDITION', Blockly.Arduino.ORDER_ATOMIC);
        const branch = Blockly.Arduino.statementToCode(block, 'DO');
        return `if (${condition}) {\n${branch}}\n`;
    };

    Blockly.Arduino['controls_whileUntil'] = function(block) {
        const condition = Blockly.Arduino.valueToCode(block, 'CONDITION', Blockly.Arduino.ORDER_ATOMIC);
        const branch = Blockly.Arduino.statementToCode(block, 'DO');
        return `while (${condition}) {\n${branch}}\n`;
    };
}

// Обновление кода при изменении блоков
function updateCode(event) {
    if (event.type === Blockly.Events.BLOCK_CREATE ||
        event.type === Blockly.Events.BLOCK_DELETE ||
        event.type === Blockly.Events.BLOCK_CHANGE ||
        event.type === Blockly.Events.BLOCK_MOVE) {
        
        const code = Blockly.Arduino.workspaceToCode(workspace);
        document.getElementById('codeOutput').textContent = code;
    }
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    initBlockly();
    
    // Обработчик кнопки "Сгенерировать код"
    document.getElementById('generateBtn').addEventListener('click', function() {
        const code = Blockly.Arduino.workspaceToCode(workspace);
        document.getElementById('codeOutput').textContent = code;
    });
    
    // Обработчик кнопки "Очистить"
    document.getElementById('clearBtn').addEventListener('click', function() {
        workspace.clear();
        document.getElementById('codeOutput').textContent = '';
    });
    
    // Обработчик кнопки "Сохранить"
    document.getElementById('saveBtn').addEventListener('click', function() {
        const code = Blockly.Arduino.workspaceToCode(workspace);
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arduino_code.ino';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
});

// Инициализация при загрузке страницы
window.addEventListener('load', function() {
    // Устанавливаем начальный код
    const initialCode = `void setup() {
  // put your setup code here, to run once:
}

void loop() {
  // put your main code here, to run repeatedly:
}`;
    
    document.getElementById('codeOutput').textContent = initialCode;
});

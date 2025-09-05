// Инициализация Blockly
let workspace = null;

// Функция инициализации редактора
function initBlockly() {
    // Создание workspace
    const toolbox = {
        kind: "flyoutToolbox",
        contents: [
            {
                kind: "category",
                name: "Основные",
                colour: "#5b80a5",
                contents: [
                    {
                        kind: "block",
                        type: "controls_if"
                    },
                    {
                        kind: "block",
                        type: "controls_whileUntil"
                    },
                    {
                        kind: "block",
                        type: "controls_delay"
                    }
                ]
            },
            {
                kind: "category",
                name: "Ввод/Вывод",
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
                name: "Переменные",
                colour: "#5b80a5",
                custom: "VARIABLE"
            }
        ]
    };

    workspace = Blockly.inject('blocklyDiv', {
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

    // Добавление кастомных блоков
    addCustomBlocks();
    
    // Установка начального кода
    const initialCode = `void setup() {
  // put your setup code here, to run once:
}

void loop() {
  // put your main code here, to run repeatedly:
}`;
    
    document.getElementById('codeOutput').textContent = initialCode;
}

// Добавление кастомных блоков
function addCustomBlocks() {
    // Блок digitalWrite
    Blockly.Blocks['controls_digital_write'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("digitalWrite");
            this.appendValueInput("VALUE")
                .setCheck(null)
                .appendField("на пин");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Запись значения на цифровой пин");
            this.setHelpUrl("");
        }
    };

    Blockly.Arduino['controls_digital_write'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
        
        return `digitalWrite(${pin}, ${value});\n`;
    };

    // Блок digitalRead
    Blockly.Blocks['controls_digital_read'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("digitalRead");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Чтение значения с цифрового пина");
            this.setHelpUrl("");
        }
    };

    Blockly.Arduino['controls_digital_read'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        
        return [`digitalRead(${pin})`, Blockly.Arduino.ORDER_NONE];
    };

    // Блок analogWrite
    Blockly.Blocks['controls_analog_write'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("analogWrite");
            this.appendValueInput("VALUE")
                .setCheck(null)
                .appendField("на пин");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Запись аналогового значения на пин");
            this.setHelpUrl("");
        }
    };

    Blockly.Arduino['controls_analog_write'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        const value = Blockly.Arduino.valueToCode(block, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
        
        return `analogWrite(${pin}, ${value});\n`;
    };

    // Блок analogRead
    Blockly.Blocks['controls_analog_read'] = {
        init: function() {
            this.appendValueInput("PIN")
                .setCheck("Number")
                .appendField("analogRead");
            this.setOutput(true, "Number");
            this.setColour(230);
            this.setTooltip("Чтение аналогового значения с пина");
            this.setHelpUrl("");
        }
    };

    Blockly.Arduino['controls_analog_read'] = function(block) {
        const pin = Blockly.Arduino.valueToCode(block, 'PIN', Blockly.Arduino.ORDER_ATOMIC);
        
        return [`analogRead(${pin})`, Blockly.Arduino.ORDER_NONE];
    };

    // Блок delay
    Blockly.Blocks['controls_delay'] = {
        init: function() {
            this.appendValueInput("TIME")
                .setCheck("Number")
                .appendField("delay");
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour(230);
            this.setTooltip("Задержка в миллисекундах");
            this.setHelpUrl("");
        }
    };

    Blockly.Arduino['controls_delay'] = function(block) {
        const time = Blockly.Arduino.valueToCode(block, 'TIME', Blockly.Arduino.ORDER_ATOMIC);
        
        return `delay(${time});\n`;
    };
}

// Генерация кода
function generateCode() {
    if (workspace) {
        const code = Blockly.Arduino.workspaceToCode(workspace);
        document.getElementById('codeOutput').textContent = 
            `void setup() {\n  // put your setup code here, to run once:\n}\n\nvoid loop() {\n${code}}`;
    }
}

// Очистка рабочей области
function clearWorkspace() {
    if (workspace) {
        workspace.clear();
        document.getElementById('codeOutput').textContent = 
            `void setup() {\n  // put your setup code here, to run once:\n}\n\nvoid loop() {\n  // put your main code here, to run repeatedly:\n}`;
    }
}

// Сохранение кода
function saveCode() {
    const code = document.getElementById('codeOutput').textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arduino_code.ino';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Загрузка кода
function loadCode() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.ino,.txt';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                // Здесь можно добавить логику для загрузки кода в Blockly
                alert('Файл загружен. Для использования в редакторе, вставьте код вручную или используйте другой способ.');
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    initBlockly();
    
    document.getElementById('generateBtn').addEventListener('click', generateCode);
    document.getElementById('clearBtn').addEventListener('click', clearWorkspace);
    document.getElementById('saveBtn').addEventListener('click', saveCode);
    document.getElementById('loadBtn').addEventListener('click', loadCode);
    
    // Обновление кода при изменении блоков
    if (workspace) {
        workspace.addChangeListener(function(event) {
            if (event.type === Blockly.Events.BLOCK_CREATE ||
                event.type === Blockly.Events.BLOCK_DELETE ||
                event.type === Blockly.Events.BLOCK_CHANGE) {
                generateCode();
            }
        });
    }
});

// Функция для обновления кода при загрузке
function updateCodeOnLoad() {
    if (workspace) {
        setTimeout(generateCode, 100);
    }
}

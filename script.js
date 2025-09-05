
// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация Blockly
    const workspace = Blockly.inject('blocklyArea', {
        toolbox: getToolbox(),
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
        }
    });

    // Генерация кода при изменении блоков
    workspace.addChangeListener(updateCode);

    // Кнопка запуска
    document.getElementById('runBtn').addEventListener('click', function() {
        const code = Blockly.Arduino.workspaceToCode(workspace);
        document.getElementById('generatedCode').textContent = code;
        
        // Здесь можно добавить логику выполнения кода
        alert('Код сгенерирован! В реальной версии здесь будет выполнение.');
    });

    // Кнопка скачивания
    document.getElementById('downloadBtn').addEventListener('click', function() {
        const code = Blockly.Arduino.workspaceToCode(workspace);
        downloadCode(code, 'arduino_sketch.ino');
    });
});

function getToolbox() {
    return `
    <xml xmlns="https://developers.google.com/blockly/xml" id="toolbox" style="display: none">
        <category name="Логика" colour="#5b80a5">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
            <block type="logic_operation"></block>
            <block type="logic_negate"></block>
            <block type="logic_boolean"></block>
        </category>
        <category name="Циклы" colour="#5b80a5">
            <block type="controls_repeat_ext"></block>
            <block type="controls_whileUntil"></block>
        </category>
        <category name="Переменные" colour="#5b80a5" custom="VARIABLE"></category>
        <category name="Функции" colour="#5b80a5" custom="PROCEDURE"></category>
        <category name="Arduino" colour="#5b80a5">
            <block type="arduino_setup"></block>
            <block type="arduino_loop"></block>
            <block type="digital_write"></block>
            <block type="digital_read"></block>
            <block type="analog_write"></block>
            <block type="analog_read"></block>
            <block type="delay"></block>
        </category>
    </xml>
    `;
}

function updateCode(event) {
    if (event.type == Blockly.Events.BLOCK_CREATE ||
        event.type == Blockly.Events.BLOCK_DELETE ||
        event.type == Blockly.Events.BLOCK_CHANGE) {
        
        const code = Blockly.Arduino.workspaceToCode(workspace);
        document.getElementById('generatedCode').textContent = code;
    }
}

function downloadCode(code, filename) {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

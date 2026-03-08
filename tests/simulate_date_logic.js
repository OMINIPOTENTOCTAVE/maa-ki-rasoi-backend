const fs = require('fs');

const OriginalDate = global.Date;

// This function creates a fake Date constructor that returns our mocked time when called without arguments
function mockSystemTime(isoString) {
    const fixedTime = new OriginalDate(isoString).getTime();

    class MockDate extends OriginalDate {
        constructor(...args) {
            if (args.length === 0) {
                super(fixedTime);
            } else {
                super(...args);
            }
        }
    }
    MockDate.now = () => fixedTime;
    global.Date = MockDate;
}

// now load timeUtils after we can mock Date if we want, or timeUtils uses global.Date dynamically.
const timeUtils = require('../src/utils/timeUtils');

async function runTests() {
    let results = [];

    function mockTimeAndTest(isoString, expectedDay) {
        mockSystemTime(isoString);
        // evaluate
        const nowIST = timeUtils.getISTTimestamp();
        let timeStr = new OriginalDate(nowIST).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' });
        results.push(`[MOCKED] UTC: ${isoString} -> IST: ${timeStr}`);

        results.push(`Is after cutoff? ${timeUtils.isAfterCutoff()}`);

        let effective = timeUtils.getEffectiveDate();
        let effStr = new OriginalDate(effective).toLocaleString('en-US', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'long' });
        results.push(`Effective Pause Date (Expects ${expectedDay}): ${effStr}`);
        results.push("---");
    }

    try {
        mockTimeAndTest('2026-03-09T16:00:00.000Z', 'Tuesday'); // 9:30 PM IST (Mon) -> Effective Tue
        mockTimeAndTest('2026-03-09T17:00:00.000Z', 'Wednesday'); // 10:30 PM IST (Mon) -> Effective Wed
        mockTimeAndTest('2026-03-14T16:00:00.000Z', 'Monday'); // 9:30 PM IST (Sat) -> Effective Mon
        mockTimeAndTest('2026-03-13T17:00:00.000Z', 'Monday'); // 10:30 PM IST (Fri) -> Effective Mon (Sat+2 = Sun -> skip to Mon)

        global.Date = OriginalDate;
        results.push("=== Date Logic Simulation Complete ===");
        fs.writeFileSync('tests/test_output.json', JSON.stringify(results, null, 2));
        process.exit(0);

    } catch (err) {
        global.Date = OriginalDate;
        fs.writeFileSync('tests/test_output.json', JSON.stringify({ error: err.message }, null, 2));
        process.exit(1);
    }
}

runTests();

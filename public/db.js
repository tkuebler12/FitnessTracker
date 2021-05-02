let db;
let workoutVersion;

const request = indexedDB.open('WorkoutDB', workoutVersion || 1);

request.onupgradeneeded = function (e) {
    console.log('Upgrade needed in IndexedDB');

    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`);

    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('WorkoutStore', { autoIncrement: true });
    }
};

request.onerror = function (e) {
    console.log(`Uh oh! ${e.target.errorCode}`);
};

function checkDatabase() {
    console.log('check db invoked');

    let newWorkout = db.newWorkout(['WorkoutStore'], 'readwrite');

    const store= newWorkout.objectStore('WorkoutStore');

    const getAll = store.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch('/', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application.json',
                },
            })
            .then((response) => response.json())
            .then((res) => {
                if (res.length !== 0) {
                    newWorkout = db.newWorkout(['WorkoutStore'], 'readwrite');

                    const currentStore = newWorkout.objectStore('WorkoutStore');

                    currentStore.clear();
                    console.log('Clearing store');
                }
            });
        }
    };
}

request.onsuccess = function (e) {
    console.log('success');
    db = e.target.result;

    if (navigator.onLine) {
        console.log('Backend online');
        checkDatabase();
    }
};

const saveRecord = (record) => {
    console.log('Save record invoked');

    const newWorkout = db.newWorkout(['WorkoutSotre'], 'readwrite');

    const store = newWorkout.objectStore('WorkoutStore');

    store.add(record);
};

window.addEventListener('online', checkDatabase);
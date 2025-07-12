import { useState } from "react";

const SettingsPage = () => {
  const [pomodoro, setPomodoro] = useState(55);
  const [shortBreak, setShortBreak] = useState(10);
  const [longBreak, setLongBreak] = useState(30);

  const saveSettings = async () => {
    await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pomodoro, shortBreak, longBreak }),
    });
    alert("Settings saved!");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Timer Settings</h1>

      <label className="block mb-2">Pomodoro Duration (minutes)</label>
      <input
        type="number"
        value={pomodoro}
        onChange={(e) => setPomodoro(Number(e.target.value))}
        className="w-full border px-4 py-2 mb-4"
      />

      <label className="block mb-2">Short Break Duration</label>
      <input
        type="number"
        value={shortBreak}
        onChange={(e) => setShortBreak(Number(e.target.value))}
        className="w-full border px-4 py-2 mb-4"
      />

      <label className="block mb-2">Long Break Duration</label>
      <input
        type="number"
        value={longBreak}
        onChange={(e) => setLongBreak(Number(e.target.value))}
        className="w-full border px-4 py-2 mb-6"
      />

      <button
        onClick={saveSettings}
        className="bg-blue-600 text-white px-6 py-2 rounded"
      >
        Save
      </button>
    </div>
  );
};

export default SettingsPage;

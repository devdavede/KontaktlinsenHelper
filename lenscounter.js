



// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: blue; icon-glyph: magic;

const targetPath = {
    lenses: "nextDateLenses.txt",
    box: "nextDateBox.txt",
  };
  
  const initialPath = {
    lenses: "initialDateLenses.txt",
    box: "initialDateBox.txt",
  };
  
  const fm = FileManager.iCloud();
  const now = new Date();
  const fullProgressWidth = 135;
  const h = 5;
  
  (async () => {
    const dir = fm.joinPath(fm.documentsDirectory(), "lenscounter/");
    const targetDates = {};
    const initialDays = {};
  
    for (const key in targetPath) {
      const path = fm.joinPath(dir, targetPath[key]);
      if (!fm.fileExists(dir)) {
        fm.createDirectory(dir, false);
      }
      targetDates[key] = Date.parse(fm.readString(path)) || now.getTime();
    }
  
    for (const key in initialPath) {
      const path = fm.joinPath(dir, initialPath[key]);
      initialDays[key] = fm.readString(path) || "0";
    }
  
    if (config.runsInWidget) {
      const diffDays = {};
  
      for (const key in targetDates) {
        diffDays[key] = Math.ceil(
          (targetDates[key] - now) / (1000 * 60 * 60 * 24)
        );
      }
  
      const widget = createWidget(diffDays.lenses, diffDays.box);
      Script.setWidget(widget);
      Script.complete();
    } else {
      await askDate(
        "In wieviel Tagen sollen die Kontaktlinsen gewechselt werden?\nWähle 'Abbruch' für keine Änderung.",
        targetPath.lenses,
        initialPath.lenses
      );
      await askDate(
        "In wieviel Tagen soll die Box gewechselt werden?\nWähle 'Abbruch' für keine Änderung.",
        targetPath.box,
        initialPath.box
      );
    }
  })();
  
  async function prompt(text) {
    const prompt = new Alert();
    prompt.addTextField();
    prompt.title = text;
    prompt.addAction("Ok");
    prompt.addAction("Abbruch");
    const index = await prompt.present();
    if (index == 1) return false;
    return prompt.textFieldValue(0);
  }
  
  async function askDate(text, targetPath, initialPath) {
    const days = await prompt(text);
  
    if (days === "" || days === false) {
      return false;
    } else if (isNaN(days)) {
      return askDate(text, targetPath, initialPath);
    }
  
    const fm = FileManager.iCloud();
    const dir = fm.joinPath(fm.documentsDirectory(), "lenscounter/");
    const path = fm.joinPath(dir, targetPath);
    fm.writeString(initialPath, days);
    const dt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
    fm.writeString(path, dt.toString());
  }
  
  function createWidget(daysLenses, daysBox) {
    const widget = new ListWidget();
    const dir = fm.joinPath(fm.documentsDirectory(), "lenscounter/");
    const initialDays = {
      lenses: fm.readString(fm.joinPath(dir, initialPath.lenses)),
      box: fm.readString(fm.joinPath(dir, initialPath.box)),
    };
  
    createBackground(widget);
    createProgress(
      widget,
      `Kontaktlinsen:\n${daysLenses} Tage übrig`,
      initialDays.lenses,
      initialDays.lenses - daysLenses
    );
    widget.add
  
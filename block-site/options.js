const textareaadd = document.getElementById("textarea-add");
const textareaactive = document.getElementById("textarea-active");
const save = document.getElementById("save");
const update = document.getElementById("update");
const lock = document.getElementById("lock");
const timefield = document.getElementById("timefield");

save.addEventListener("click", () => {
	let content = textareaadd.value;
    chrome.storage.local.get(["blocked"], function (local) {
        textareaadd.value = "";
        if(Array.isArray(local.blocked))
        {
            local.blocked.forEach(el => {
                content += "\n" + el;
            });
        }
        textareaactive.value = content.trim();
        const blocked = content.split("\n").map(s => s.trim()).filter(Boolean);
        chrome.storage.local.set({ blocked });
    });
});

update.addEventListener("click", () => {
    const blocked = textareaactive.value.split("\n").map(s => s.trim()).filter(Boolean);
    chrome.storage.local.set({ blocked });
  });

lock.addEventListener("click", (event) => {
	const datenow = Date.now();
	let duration = datenow + (90 * 24 * 60 * 60 * 1000);
	chrome.storage.local.set({ duration });
	hideElements();
});

window.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["blocked", "duration"], function (local) {
    const { blocked, duration } = local;
    if (Array.isArray(blocked)) {
      textareaactive.value = blocked.join("\n");
      const date = new Date(duration);
      if(duration - Date.now() <= 0)
      {
		displayElement();
      }
      else
      {
        const content = document.createTextNode(`Locked for 90 days until: ${date.toDateString()}.`);
        timefield.appendChild(content);
      }
    }
  });
});

function hideElements()
{
	const hidden = document.querySelectorAll(".hidden");
	hidden.forEach(el => {
		el.style.display = "none";
	})	
}
function displayElement()
{
	const hidden = document.querySelectorAll(".hidden");
	hidden.forEach(el => {
		el.style.display = "block";
	})
}
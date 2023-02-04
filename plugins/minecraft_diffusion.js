(function() {
    // Global variables
    var button;

    Plugin.register('minecraft_diffusion', {
        title: 'Minecraft Diffusion',
        author: 'Jen Guriel',
        icon: 'icon',
        description: 'Use Stable Diffusion to add variety to your Minecraft skins!',
        version: '1.0.0',
        tags: 'Minecraft, Stable Diffusion, Generative AI',
        variant: 'both',
        onload() {
            button = new Action('dream_new_texture', {
                name: 'Dream New Texture',
                description: 'Randomly generate a new texture using Stable Diffusion',
                icon: 'bar_chart',
                click: function() {

                    // My undo isn't working right yet
                    //Undo.initEdit({elements: Texture.selected});

                    let prompt = '';

                    //Texture.all[0].remove(true);
                    //new Texture({name: 'steve-NEW'}).fromPath('D:\\Projects\\MinecraftDiffusion\\Skins\\steve-NEW.png').add(false);

                    const dialog = new Dialog({
                        title: "Dream a New Texture",
                        id: "dream_dialog",
                        width: 780,
                        lines: [`
                          <style>
                            dialog#dream_dialog .input-box {
                                padding: 10px;
                                width: 80%;
                                border: 1px solid black;
                            }
                          </style>
                        `],
                        component: {
                            template: `
                              <div>
                                <p>Prompt:</p>
                                <div>
                                  <input class="input-box" type="text" min="1" max="256" @input="changePrompt()"></input>
                                </div>
                                <br>
                                <div style="display:flex;gap:8px">
                                  <button id="dream" @click="dream()">Dream</button>
                                  <button @click="close()">Cancel</button>
                                </div>
                              </div>
                            `,
                            methods: {
                              changePrompt() {
                                prompt = document.querySelector('.input-box').value;
                              },
                              dream() {
                                callTextToImage(prompt);
                                this.close()
                              },
                              close: () => dialog.cancel()
                            }
                          },
                          buttons: []
                        })
                    dialog.show()
                    
                    //Undo.finishEdit('Dream new texture');
                }
            });

            MenuBar.addAction(button, 'filter');
        },
        onunload() {
            button.delete();
        }
    });
})();

async function callTextToImage(prompt) {
  console.log("Dreaming of a new texture: " + prompt);
  const payload = {
    "prompt": prompt,
    "steps": 20,
  };
  const response = await fetch('http://127.0.0.1:7860/sdapi/v1/txt2img', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await response.json();

  console.log(data);

  data['images'].forEach(function (i) {
    const imageData = i.split(',', 1)[0];
    new Texture().fromDataURL('data:image/png;base64,' + imageData).add();
  });
}

function resizeImage(imageData) {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  context.drawImage(image, 0, 0, 64, 64);
  const resizedImage = canvas.toDataURL();
  return resizedImage;
}
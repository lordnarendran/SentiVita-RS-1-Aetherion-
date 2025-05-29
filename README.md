# SentiVita-RS-1-Aetherion-
A Multidisciplinary Healthcare System
To run this project, the following steps need to be done:

Step 1:
First, clone the entire repository. Then update the paths in the backend Python file. This includes setting the correct path for the LLaMA 3.2 1B model in GGUF format, the 14 image datasets in .pth format, and the three folders: Registration, Authentication, and Authentication_Logs. These folders should be created manually if they don’t exist. Initially, the backend file is in a folder called gguf-api, but you can move it elsewhere once the setup is done.

Step 2:
Now go to the file called LaunchAetherion.bat, which is inside the Aetherion/app folder. Open it in Notepad (don’t use "Save As" later). You’ll need to update three things in it:

Set the FRONTEND_PATH to point to the Aetherion/app folder.

Set the BACKEND_PATH to wherever you placed your backend file.

Set the NGROK_PATH to the location where ngrok.exe is saved. This will be in the SentiVita Backup/ngrok folder that comes with the repo.

The SCRIPT_FILE path doesn’t need to be changed if the frontend path is correct.

Step 3:
Once all paths are set, save the batch file and simply double-click it. It will open three terminal windows:

The first shows whether the backend port is active.

The second runs ngrok and gives you a URL (something like https://abcd-1234.ngrok-free.app).

The third will ask you to paste the ngrok URL. Once you do that and press Enter, it will launch the full system in your browser.

Step 4:
This system depends on APIs, so make sure your internet connection is stable. After launching, the interface will load and you can start using all features like login, registration, AI inference, 3D visualization, etc.

Important:
The GGUF model file and its associated tokenizer/config files will be shared with you through a separate download link. After downloading, place them in a folder like llm_model/ and update the backend to load the model from that folder using:
model = GPT4All("llm_model/your-model-name.gguf")

You should remove or comment out any lines in the backend that refer to gguf-api if they exist—they’re not needed anymore.

That’s it! If you follow these steps, Aetherion should launch smoothly.



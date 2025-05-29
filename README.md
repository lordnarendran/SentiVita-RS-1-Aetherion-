# SentiVita-RS-1-Aetherion-
A Multidisciplinary Healthcare System
To run this project, the following steps need to be done:

ResNet50 Trained Files Link: https://drive.google.com/drive/folders/1cGGxI_1bL8HInEMp9aXibgbWvs-vKwFB?usp=sharing
Fine Tuned Llama 3.2 1B: https://drive.google.com/file/d/1UPbOXws0wXxJqItDXLD4nCcNGknaOv-4/view?usp=sharing
NGROK Download Link: https://drive.google.com/file/d/1VNMcJeJOO3m-cWdCBzKt2-xX2hja7Hnf/view?usp=sharing


Step 1:
First, clone the entire repository. Then update the paths in the backend Python file. This includes setting the correct path for the LLaMA 3.2 1B model in GGUF format, the 14 image datasets in .pth format, and the three folders: Registration, Authentication, and Authentication_Logs. These folders should be created manually if they don’t exist. The backend file has been already added in the repository. This is a very crucial step as the user needs to set up a virtual enviroment first in their system whose steps are shown below:
- The user can create a virtual enviroment in their system and name is anything, for example gguf-api where the backend script will be present and it will be activated through this command in the LaunchAetherion File: vsnv\Scripts\activate && python Backend.py. Please make sure the virtual enviroment is setup correctly and added in Launch Aetherion File. Download the ResNet files, Llama Model, andn the Ngrok from the links given above. User can keep the files anywhere but, the best approach is to have one file which handles everything.

Step 2:
Now go to the file called LaunchAetherion.bat, which is inside the Aetherion/app folder. Open it in Notepad (don’t use "Save As" later). You’ll need to update three things in it:

Set the FRONTEND_PATH to point to the Aetherion/app folder.

Set the BACKEND_PATH to wherever you placed your backend file.

Set the NGROK_PATH to the location where ngrok.exe is downloaded. Link to download ngrok has been given in the begining of the read.nme.

The SCRIPT_FILE path doesn’t need to be changed if the frontend path is correct.

Step 3:
Once all paths are set, save the batch file and simply double-click it. It will open three terminal windows:

The first shows whether the backend port is active.

The second runs ngrok and gives you a URL (something like https://abcd-1234.ngrok-free.app).

The third will ask you to paste the ngrok URL. Once you do that and press Enter, it will launch the full system in your browser ( Click Enter 3 to 4 Timnes in case one click doesn't work )

Step 4:
This system depends on APIs, so make sure your internet connection is stable. After launching, the interface will load and you can start using all features like login, registration, LLM inference, Prediction. visualization, 3D Limb Reconstruction, and etc.

The Llama File is also given which is named as Merged_Model.

That’s it! If you follow these steps, Aetherion should launch smoothly.



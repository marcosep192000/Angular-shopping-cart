const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn, exec } = require("child_process");

let mainWindow;
let springProcess;
let angularProcess;

// Ruta del JAR de Spring Boot
const springJarPath =
  "D:\\proyectos BACKEND\\inventario_Final\\Inventario-pixel\\target\\inventario-pixels-0.0.1-SNAPSHOT.jar";

app.whenReady().then(() => {
  console.log("Iniciando aplicación...");

  // 1️⃣ Iniciar Spring Boot
  springProcess = spawn("java", ["-jar", springJarPath]);

  springProcess.stdout.on("data", (data) => {
    console.log(`Spring Boot: ${data}`);
  });
  springProcess.stderr.on("data", (data) => {
    console.error(`Error en Spring Boot: ${data}`);
  });
  // 2️⃣ Iniciar Angular en modo desarrollo
  angularProcess = spawn("npm", ["start"], { shell: true });
  angularProcess.stdout.on("data", (data) => {
    console.log(`Angular: ${data}`);
  });
  angularProcess.stderr.on("data", (data) => {
    console.error(`Error en Angular: ${data}`);
  });
  // 3️⃣ Crear ventana de Electron cuando Angular esté listo
  setTimeout(() => {
    mainWindow = new BrowserWindow({
      width: 1920,
      height: 980,
      frame: true, // Eliminar los bordes estándar (ventana sin marco)
      resizable: false,  //Permite que la ventana sea redimensionable
      webPreferences: {
      nodeIntegration: false,
      },
    });
    mainWindow.loadURL("http://localhost:4200"); // Angular en modo desarrollo
    mainWindow.on("closed", () => {
      mainWindow = null;
      cerrarProcesos();
    });
  }, 10000); // Espera 10 segundos para asegurarse de que Angular y Spring Boot arrancan
});
// Cerrar procesos cuando Electron se cierre
app.on("window-all-closed", () => {
  cerrarProcesos();
  if (process.platform !== "darwin") app.quit();
});
// Función para matar Spring Boot y Angular
function cerrarProcesos() {
  if (springProcess) {
    console.log("Cerrando Spring Boot...");
    springProcess.kill();
  }
  if (angularProcess) {
    console.log("Cerrando Angular...");
    angularProcess.kill();
  }
}

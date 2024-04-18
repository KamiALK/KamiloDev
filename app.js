import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import { getDay } from "date-fns";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";

// import chatgpt from "./services/openai/chatgpt.js";
import GoogleSheetService from "./services/sheets/index.js";

const googelSheet = new GoogleSheetService(
 "1pcBkWWa0x-q-mwV54bRMOixjCv-tFVvLSrzGPsPPQgQ" 
);

const GLOBAL_STATE = [];
const MENU_CLIENTE=[];

const Columna = {

  'SOPAS': 1,
  'PROTEINA': 2,
  'acomp_a': 6,

};

const PROTEINAS = {
  1:2,
  2:3,
  3:4,
  4:5,
}








const flowPrincipal = bot
  .addKeyword(["hola", "hi","buenos dias","buenas tardes"])
  .addAnswer([
    `Bienvenidos a mi restaurante de cocina economica automatizado! 🚀`,
    `Tenemos menus diarios variados`,
    `Te gustaria conocerlos ¿?`,
    `Escribe *si*`,
  ]);



const flowMenu = bot                                                                                                          
  .addKeyword("menu", { capture: true })                                                                                      
  .addAnswer(                                                                                                                 
    `Hoy tenemos el siguiente menú:`,                                                                                         
    null,                                                                                                                     
    async (_, { flowDynamic }) => {                                                                                           
      try {                                                                                                                   
        const columnNumber=1;                                                                                                 
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas    
                                                                                                                              
        if (getMenu.length === 0) {                                                                                           
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");                                                   
          return;                                                                                                             
        }                                                                                                                     
                                                                                                                              
        for (const menu of getMenu) {                                                                                         
          GLOBAL_STATE.push(menu);                                                                                            
          await flowDynamic(menu);                                                                                            
        }                                                                                                                     
        console.log("Contenido de GLOBAL_STATE:", GLOBAL_STATE);                                                              
      } catch (error) {                                                                                                       
        console.error("Error al recuperar el menú:", error);                                                                  
        await flowDynamic("Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.");         
      }                                                                                                                       
    }                                                                                                                         
  )                                                                                                                           
  .addAnswer(                                                                                                                 
    `¿Te interesa alguno marca la opcion?`,                                                                                   
    { capture: true },                                                                                                        
    async (ctx, { gotoFlow, state }) => {                                                                                     
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE

      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });                                                                                  

      // Redirigir al flujo de pedido                                                                                         
      return gotoFlow(flowPedido);                                                                                              
    }                                                                                                                         
  );














































const flowNextProteina= bot
  .addKeyword("si", { capture: true })
  .addAnswer(
    `Tenenmos las siguientes carnes:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber=2;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas
        
        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
        console.log("Contenido de GLOBAL_STATE:", GLOBAL_STATE);
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic("Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  )
  .addAnswer(                                                                                                               
    `¿Te interesa alguno marca la opcion?`,                                                                                 
    { capture: true },                                                                                                      
    async (ctx, { gotoFlow, state }) => {                                                                                   
      // Almacenar la opción seleccionada en el estado                                                                      
      state.update({ pedido: ctx.body.trim() });                                                                            
                                                                                                                            
      // Redirigir al flujo de pedido                                                                                       
      return gotoFlow(flowMenu);                                                                                          
    }                                                                                                                       
  )                                                                                                                         












const flowProteina = bot                                                                                                   
  .addKeyword("proteina", { capture: true })                                                                               
  .addAnswer(                                                                                                              
    `Hoy tenemos el siguiente menú:`,                                                                                      
    null,                                                                                                                  
    async (_, { flowDynamic }) => {                                                                                        
      try {                                                                                                                
        const columnNumber = 1;                                                                                            
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas 
                                                                                                                           
        if (getMenu.length === 0) {                                                                                        
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");                                                
          return;                                                                                                          
        }                                                                                                                  
                                                                                                                           
        // Mostrar el menú al usuario y registrar las selecciones                                                          
        for (const option of getMenu) {                                                                                    
          await flowDynamic(option); // Mostrar opción al usuario                                                          
          const userInput = await flowDynamic(); // Esperar la respuesta del usuario                                       
                                                                                                                           
          // Almacenar la selección del usuario en MENU_CLIENTE o en el diccionario                                        
          MENU_CLIENTE[option] = userInput;                                                                                
        }                                                                                                                  
                                                                                                                           
        console.log("Selecciones del usuario:", MENU_CLIENTE); // Mostrar las selecciones del usuario                      
      } catch (error) {                                                                                                    
        console.error("Error al recuperar el menú:", error);                                                               
        await flowDynamic("Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.");      
      }                                                                                                                    
    }                                                                                                                      
  )                                                                                                                       
  .addAnswer(                                                                                                            
    `¿Te interesa alguno marca la opcion?`,                                                                              
    { capture: true },                                                                                                   
    async (ctx, { gotoFlow, state }) => {                                                                                
      // Almacenar la opción seleccionada en el estado                                                                   
      state.update({ pedido: ctx.body.trim() });                                                                         
                                                                                                                           
      // Redirigir al flujo de pedido                                                                                    
      return gotoFlow(flowMenu);                                                                                       
    }                                                                                                                    
  )                                                                                                           
















































































const flowPrueba = bot
  .addKeyword("prueba", {capture:true})
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const dayNumber = 1;
        const getMenu = await googelSheet.retriveDayMenu (dayNumber); // Recupera el menú del día actual sin usar fechas
        
        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
        // Imprimir el contenido de GLOBAL_STATE después de que se haya llenado
        console.log("Contenido de GLOBAL_STATE:", GLOBAL_STATE);
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic("Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.");
      }
    }
  );





const flowEmpty = bot
  .addKeyword(bot.EVENTS.ACTION)
  .addAnswer("No te he entendido!", null, async (_, { gotoFlow }) => {
    return gotoFlow(flowMenu);
  });

const flowPedido = bot
  .addKeyword(["pedir"])
  .addAnswer(
    "¿Cual es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ name: ctx.body });
    }
  )
  .addAnswer(
    "¿Alguna observacion?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ observaciones: ctx.body });
    }
  )
  .addAnswer(
    "Perfecto tu pedido estara listo en un aprox 20min",
    null,
    async (ctx, { state }) => {
        const currentState = state.getMyState();
      await googelSheet.saveOrder({
        fecha: new Date().toDateString(),
        telefono: ctx.from,
        nombre: currentState.name,
        pedido: currentState.pedido,
        observaciones: currentState.observaciones,
      });
    }
  );

const testFlow = bot
  .addKeyword(["escribir"]) // Palabra clave para activar el flujo de prueba
  .addAnswer(
    "pruebas de escritura",
    null,
    async (ctx, { state }) => {
      // Simulación de datos para escribir en la hoja de cálculo
      const data = {
        fecha: new Date().toDateString(),
        telefono: "123456789", // Número de teléfono de ejemplo
        nombre: "Usuario de prueba", // Nombre de ejemplo
        pedido: "Pedido de prueba", // Pedido de ejemplo
        observaciones: "Sin observaciones", // Observaciones de ejemplo
      };

      // Guardar el pedido ` ` `` en la hoja de cálculo
      await googelSheet.saveOrder(data);
    }
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
    flowPrincipal,
    flowMenu,
    flowPrueba,
    flowPedido,
    flowProteina,
    testFlow,
    flowEmpty,
  ]);
  const adapterProvider = bot.createProvider(BaileysProvider);

  bot.createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();

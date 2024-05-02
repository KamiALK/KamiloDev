import "dotenv/config";
import bot from "@bot-whatsapp/bot";
import { getDay } from "date-fns";
import QRPortalWeb from "@bot-whatsapp/portal";
import BaileysProvider from "@bot-whatsapp/provider/baileys";
import MockAdapter from "@bot-whatsapp/database/mock";

// import chatgpt from "./services/openai/chatgpt.js";
import GoogleSheetService from "./services/sheets/index.js";

const googelSheet = new GoogleSheetService(
  "1pcBkWWa0x-q-mwV54bRMOixjCv-tFVvLSrzGPsPPQgQ",
);

let GLOBAL_STATE = [];

const MENU_CLIENTE = {
  pollo: [],
  res: [],
  cerdo: [],
  pescado: [],
  proteina: [],
  sopa: [],
  bebida: [],
  acomp_a: [],
  acomp_b: [],
  acomp_c: [],
};
const flowPrincipal = bot
  .addKeyword(["hola", "hi", "buenos dias", "buenas tardes"])
  .addAnswer([
    `Bienvenidos a mi restaurante de cocina economica automatizado! 🚀`,
    `Tenemos menus diarios variados`,
    `Te gustaria conocerlos ¿?`,
    `Escribe *si*`,
  ]);

const flowAcomp_a = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 6;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.acomp_a.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowAcomp_b);
    },
  );

const flowProteina = bot
  .addKeyword("si", { capture: true })
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

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )

  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      try {
        const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
        const seleccion = GLOBAL_STATE[opcionSeleccionada - 1].split(". ")[1];
        // Almacenar la selección del usuario en MENU_CLIENTE
        console.log(GLOBAL_STATE);
        // Almacenar el elemento seleccionado en el estado
        state.update({ pedido: seleccion });
        GLOBAL_STATE = [];
        // Redirigir al flujo correspondiente basado en la opción seleccionada
        switch (opcionSeleccionada) {
          case 1:
            return gotoFlow(flowPollo);

          case 2:
            return gotoFlow(flowPescado);
          case 3:
            return gotoFlow(flowRes);
          case 4:
            return gotoFlow(flowCerdo);
          default:
            return gotoFlow(flowPrincipal);
        }
      } catch (error) {
        console.error("Ocurrió un error:", error);
        // Redirigir al flujo principal en caso de error
        return gotoFlow(flowPrincipal);
      }
    },
  );

const flowPollo = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 2;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); //Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      try {
        const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
        const seleccion = GLOBAL_STATE[opcionSeleccionada - 1].split(". ")[1];
        MENU_CLIENTE.pollo.push(seleccion);
        // Almacenar el elemento seleccionado en el estado
        console.log(`Imprimido desde pollo: ${GLOBAL_STATE}`);
        state.update({ pedido: seleccion });

        GLOBAL_STATE = [];
        // Redirigir al flujo de pedido
        return gotoFlow(flowAcomp_a);
      } catch (error) {
        console.error("Ocurrió un error:", error);
        // Redirigir al flujo principal
        return gotoFlow(flowPrincipal);
      }
    },
  );
const flowPescado = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 3;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.pescado.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowAcomp_a);
    },
  );

const flowRes = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 4;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.res.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowAcomp_a);
    },
  );

const flowCerdo = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 5;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.cerdo.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowAcomp_a);
    },
  );

const flowAcomp_b = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 7;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.acomp_b.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowAcomp_c);
    },
  );

const flowAcomp_c = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 8;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.acomp_c.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowSopa);
    },
  );

const flowSopa = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 9;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.sopa.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowBebida);
    },
  );

const flowBebida = bot
  .addKeyword("menu", { capture: true })
  .addAnswer(
    `Hoy tenemos el siguiente menú:`,
    null,
    async (_, { flowDynamic }) => {
      try {
        const columnNumber = 10;
        const getMenu = await googelSheet.retriveDayMenu(columnNumber); // Recupera el menú del día actual sin usar fechas

        if (getMenu.length === 0) {
          await flowDynamic("Lo siento, no hay menú disponible para hoy.");
          return;
        }

        for (const menu of getMenu) {
          GLOBAL_STATE.push(menu);
          await flowDynamic(menu);
        }
      } catch (error) {
        console.error("Error al recuperar el menú:", error);
        await flowDynamic(
          "Lo siento, hubo un error al recuperar el menú. Por favor, inténtalo de nuevo más tarde.",
        );
      }
    },
  )
  .addAnswer(
    `¿Te interesa alguno marca la opcion?`,
    { capture: true },
    async (ctx, { gotoFlow, state }) => {
      const opcionSeleccionada = parseInt(ctx.body.trim()); // Convertir la opción seleccionada a un entero
      const seleccion = GLOBAL_STATE[opcionSeleccionada - 1]; // Obtener el elemento correspondiente en GLOBAL_STATE
      // Almacenar la selección del usuario en MENU_CLIENTE
      MENU_CLIENTE.bebida.push(seleccion);
      // Almacenar el elemento seleccionado en el estado
      state.update({ pedido: seleccion });

      GLOBAL_STATE = [];
      // Redirigir al flujo de pedido
      return gotoFlow(flowPedido);
    },
  );

const flowEmpty = bot
  .addKeyword(bot.EVENTS.ACTION)
  .addAnswer("No te he entendido!", null, async (_, { gotoFlow }) => {
    return gotoFlow(flowPrincipal);
  });

const flowPedido = bot
  .addKeyword(["pedir"])
  .addAnswer(
    "¿Cual es tu nombre?",
    { capture: true },
    async (ctx, { state }) => {
      state.update({ name: ctx.body });
    },
  )
  .addAnswer("¿Direccion?", { capture: true }, async (ctx, { state }) => {
    state.update({ observaciones: ctx.body });
  })
  .addAnswer(
    "Perfecto tu pedido estara listo en un aprox 20min",
    null,
    async (ctx, { state }) => {
      const currentState = state.getMyState();
      console.log(currentState.pedido);
      console.log(MENU_CLIENTE);

      // Filtrar las opciones vacías de MENU_CLIENTE y crear un mensaje corto
      const pedido = Object.entries(MENU_CLIENTE)
        .filter(([key, value]) => value.length > 0)
        .map(([key, value]) => `${key}: ${value.join(", ")}`)
        .join("\n");

      // Guardar el pedido
      await googelSheet.saveOrder({
        fecha: new Date().toDateString(),
        telefono: ctx.from,
        nombre: currentState.name,
        pedido: pedido,
        observaciones: currentState.observaciones,
      });

      // Limpiar la variable MENU_CLIENTE
      for (const key in MENU_CLIENTE) {
        if (Object.hasOwnProperty.call(MENU_CLIENTE, key)) {
          MENU_CLIENTE[key] = []; // Asignar un array vacío a cada propiedad
        }
      }
    },
  );

const main = async () => {
  const adapterDB = new MockAdapter();
  const adapterFlow = bot.createFlow([
    flowPrincipal,
    flowPedido,
    flowPollo,
    flowRes,
    flowCerdo,
    flowPescado,
    flowProteina,
    flowSopa,
    flowBebida,
    flowAcomp_a,
    flowAcomp_b,
    flowAcomp_c,

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

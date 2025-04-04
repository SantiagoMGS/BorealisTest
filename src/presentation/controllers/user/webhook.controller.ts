import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";

@Controller('webhook')
export class WebhookController {
  @Post()
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    // Validación inicial (cuando se crea la suscripción)
    if (body && body.validationToken) {
      return body.validationToken
    }

    // Notificación de cambio (usuario creado)

    // Aquí puedes procesar los usuarios
    if (body?.value) {
      for (const event of body.value) {
        if (event.changeType === 'created') {
          const userId = event.resourceData?.id;

          // Aquí puedes consultar Graph con el ID, guardar en DB, etc.
        }
      }
    }

    return HttpStatus.ACCEPTED
  }
}
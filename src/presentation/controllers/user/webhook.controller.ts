import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  @Post()
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Manejar webhook de Microsoft Graph (validación o notificación)' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Webhook recibido y aceptado correctamente.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El cuerpo del webhook es inválido o incompleto.',
  })
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    // 🔹 Validación de suscripción (paso inicial del webhook Graph API)
    if (body?.validationToken) {
      return res.status(HttpStatus.OK).send(body.validationToken);
    }

    // 🔹 Evento de creación de usuario
    if (body?.value) {
      for (const event of body.value) {
        if (event.changeType === 'created') {
          const userId = event.resourceData?.id;
          // Aquí puedes consultar Microsoft Graph con el ID
          // y registrar el usuario en tu base de datos
        }
      }
    }

    return res.sendStatus(HttpStatus.ACCEPTED);
  }
}

import { Injectable } from "@nestjs/common"
import axios from "axios"

@Injectable()
export class PaystackService {
  private baseUrl = "https://api.paystack.co"
  private secretKey = process.env.PAYSTACK_SECRET_KEY

  async initializePayment(data: any) {
    try {
      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, data, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          "Content-Type": "application/json",
        },
      })

      return response.data.data
    } catch (error) {
      throw new Error(`Paystack initialization failed: ${(error as Error).message}`)
    }
  }

  async verifyPayment(reference: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/transaction/verify/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      })

      return response.data.data
    } catch (error) {
      throw new Error(`Paystack verification failed: ${(error as Error).message}`)
    }
  }

  async getPaymentDetails(reference: string) {
    try {
      const response = await axios.get(`${this.baseUrl}/transaction/${reference}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      })

      return response.data.data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      throw new Error(`Error generating Google Meet link: ${errorMessage}`)
    }
  }
}

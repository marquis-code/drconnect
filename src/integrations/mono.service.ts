import { Injectable, BadRequestException } from "@nestjs/common"
import axios from "axios"

interface MonoPaymentInitData {
  amount: number
  type: string
  method: string
  description: string
  reference: string
  redirect_url: string
  customer: {
    email: string
    phone: string
    address: string
    name: string
    identity: {
      type: string
      number: string
    }
  }
  meta?: Record<string, any>
}

@Injectable()
export class MonoService {
  private baseUrl = "https://api.withmono.com/v2"
  private secretKey = process.env.MONO_SECRET_KEY

  async initializePayment(data: MonoPaymentInitData) {
    try {
      if (!this.secretKey) {
        throw new BadRequestException("Mono API key not configured")
      }

      const response = await axios.post(`${this.baseUrl}/payments/initiate`, data, {
        headers: {
          "mono-sec-key": this.secretKey,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      })

      return {
        status: "success",
        data: response.data,
      }
    } catch (error: any) {
      console.error("[v0] Mono initialization error:", error.response?.data || error.message)
      throw new BadRequestException(
        `Mono payment initialization failed: ${error.response?.data?.message || error.message}`,
      )
    }
  }

  async verifyPayment(reference: string) {
    try {
      if (!this.secretKey) {
        throw new BadRequestException("Mono API key not configured")
      }

      const response = await axios.get(`${this.baseUrl}/payments/verify/${reference}`, {
        headers: {
          "mono-sec-key": this.secretKey,
          accept: "application/json",
        },
      })

      return {
        status: response.data.status === "successful" ? "success" : "failed",
        reference: response.data.reference,
        amount: response.data.amount,
        data: response.data,
      }
    } catch (error: any) {
      console.error("[v0] Mono verification error:", error.response?.data || error.message)
      throw new BadRequestException(
        `Mono payment verification failed: ${error.response?.data?.message || error.message}`,
      )
    }
  }

  async getTransactionHistory(page = 1, startDate?: string, endDate?: string, status?: string) {
    try {
      if (!this.secretKey) {
        throw new BadRequestException("Mono API key not configured")
      }

      const params = new URLSearchParams()
      params.append("page", page.toString())

      if (startDate) params.append("start", startDate)
      if (endDate) params.append("end", endDate)
      if (status) params.append("status", status)

      const response = await axios.get(`${this.baseUrl}/payments/transactions?${params.toString()}`, {
        headers: {
          "mono-sec-key": this.secretKey,
          accept: "application/json",
        },
      })

      return {
        status: "success",
        data: response.data,
      }
    } catch (error: any) {
      console.error("[v0] Mono transaction history error:", error.response?.data || error.message)
      throw new BadRequestException(
        `Failed to retrieve transaction history: ${error.response?.data?.message || error.message}`,
      )
    }
  }

  async getPaymentStatus(reference: string) {
    try {
      if (!this.secretKey) {
        throw new BadRequestException("Mono API key not configured")
      }

      const response = await axios.get(`${this.baseUrl}/payments/verify/${reference}`, {
        headers: {
          "mono-sec-key": this.secretKey,
          accept: "application/json",
        },
      })

      return {
        status: response.data.status,
        reference: response.data.reference,
        amount: response.data.amount,
        data: response.data,
      }
    } catch (error: any) {
      console.error("[v0] Mono status check error:", error.response?.data || error.message)
      throw new BadRequestException(`Failed to get payment status: ${error.response?.data?.message || error.message}`)
    }
  }
}

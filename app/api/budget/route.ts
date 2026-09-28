import { NextResponse } from "next/server";
import {
  getBudget,
  createBudget,
  updateBudget,
} from "@/services/budget.service";
getCurrentUser()
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month");

    if (!month) {
      return NextResponse.json(
        { message: "Month is required" },
        { status: 400 }
      );
    }

    const budget = await getBudget(
      user.id,
      new Date(month)
    );

    return NextResponse.json({
      budget,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { month, amount } = body;

    if (!month || amount === undefined) {
      return NextResponse.json(
        { message: "Month and amount are required" },
        { status: 400 }
      );
    }

    const budget = await createBudget(
      user.id,
      new Date(month),
      Number(amount)
    );

    return NextResponse.json(
      { budget },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "INVALID_AMOUNT") {
        return NextResponse.json(
          { message: "Amount must be greater than 0" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to create budget" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      budgetId,
      amount,
    } = body;

    if (!budgetId || amount === undefined) {
      return NextResponse.json(
        { message: "Budget ID and amount are required" },
        { status: 400 }
      );
    }

    const budget = await updateBudget(
      user.id,
      budgetId,
      Number(amount)
    );

    return NextResponse.json({
      budget,
    });
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      if (error.message === "INVALID_AMOUNT") {
        return NextResponse.json(
          { message: "Amount must be greater than 0" },
          { status: 400 }
        );
      }

      if (error.message === "BUDGET_NOT_FOUND") {
        return NextResponse.json(
          { message: "Budget not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { message: "Failed to update budget" },
      { status: 500 }
    );
  }
}
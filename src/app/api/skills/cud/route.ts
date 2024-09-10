import { NextRequest, NextResponse } from "next/server";
import connectDb from "@/config/db";
import Skills from "@/models/skills";
import { revalidatePath } from "next/cache";

// Initialize database connection
connectDb();

// Define the expected request body structure
interface SkillRequestBody {
  _id?: string; // For PUT and DELETE
  domain: string;
  skills: string[];
}

// Handle POST requests to create a new skill
export async function POST(req: NextRequest) {
  try {
    const reqBody: SkillRequestBody = await req.json();
    const { domain, skills } = reqBody;

    const newSkill = new Skills({
      domain,
      skills,
    });
    await newSkill.save();

    // Revalidate cache for the "/about" page after successful operation
    revalidatePath("/about");

    return NextResponse.json(
      {
        message: "Skill added successfully",
        newSkill,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    let errorMessage = "An unexpected error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;

      // Custom parsing of Mongoose validation errors
      if (errorMessage.includes("validation failed:")) {
        errorMessage = errorMessage
          .split("validation failed:")[1]
          .split(":")[1];
      }
    }

    return NextResponse.json(
      {
        message: errorMessage,
        success: false,
      },
      { status: 500 }
    );
  }
}

// Handle PUT requests to update an existing skill
export async function PUT(req: NextRequest) {
  try {
    const reqBody: SkillRequestBody = await req.json();
    const { _id, domain, skills } = reqBody;

    if (!_id) {
      return NextResponse.json(
        {
          message: "Missing skill ID for update",
          success: false,
        },
        { status: 400 }
      );
    }

    await Skills.findOneAndUpdate({ _id }, { domain, skills });

    revalidatePath("/about");

    return NextResponse.json(
      {
        message: "Skill updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error: " + error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to remove a skill
export async function DELETE(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { id } = reqBody;

    if (!id) {
      return NextResponse.json(
        {
          message: "Missing skill ID for deletion",
          success: false,
        },
        { status: 400 }
      );
    }

    await Skills.deleteOne({ _id: id });

    revalidatePath("/about");

    return NextResponse.json(
      {
        message: "Skill deleted successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal server error: " + error.message,
        success: false,
      },
      { status: 500 }
    );
  }
}

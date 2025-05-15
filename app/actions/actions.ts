"use server";
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Homepage from "@/models/Homepage";
import TeamMember from "@/models/TeamMember";
import Product from "@/models/Product";
import User from "@/models/User";
import { hash } from "bcryptjs";
import Service from "@/models/Service";

interface ActionResponse {
  success: boolean;
  message?: string;
  data?: {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

// Generic function to create an entity
export async function createEntity(model: string, data: any): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "Blog":
        Entity = Blog;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      case "Service":
        Entity = Service;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    // Sanitize data to avoid circular references
    const sanitizedData = JSON.parse(JSON.stringify(data));

    const entity = new Entity(sanitizedData);
    await entity.save();

    return {
      success: true,
      message: `${model} created successfully`,
      data: {
        _id: entity._id,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    };
  } catch (error: any) {
    console.error(`Error creating ${model}:`, error);
    return {
      success: false,
      message: error.message || `Failed to create ${model}`,
    };
  }
}

// Generic function to update an entity
export async function updateEntity(model: string, id: string, data: any): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "Blog":
        Entity = Blog;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      case "Service":
        Entity = Service;
        break;
      case "User":
        Entity = User;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    // Sanitize data to avoid circular references
    const sanitizedData = JSON.parse(JSON.stringify(data));

    const updatedEntity = await Entity.findByIdAndUpdate(id, sanitizedData, { new: true });

    if (!updatedEntity) {
      return {
        success: false,
        message: `${model} not found`,
      };
    }

    return {
      success: true,
      message: `${model} updated successfully`,
      data: {
        _id: updatedEntity._id,
        updatedAt: updatedEntity.updatedAt,
      },
    };
  } catch (error: any) {
    console.error(`Error updating ${model}:`, error);
    return {
      success: false,
      message: error.message || `Failed to update ${model}`,
    };
  }
}

// Generic function to delete an entity
export async function deleteEntity(model: string, id: string): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;
    console.log(model, id);

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "Blog":
        Entity = Blog;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      case "Service":
        Entity = Service;
        break;
      case "User":
        Entity = User;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }
    const deletedEntity = await Entity.findByIdAndDelete(id);
    console.log("deletedEntity", deletedEntity);
    if (!deletedEntity) {
      return {
        success: false,
        message: `${model} not found`,
      };
    }

    return {
      success: true,
      message: `${model} deleted successfully`,
    };
  } catch (error: any) {
    console.error(`Error deleting ${model}:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete ${model}`,
    };
  }
}

// Generic function to get an entity by ID
export async function getEntity(model: string, id: string): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    const entity = await Entity.findById(id);

    if (!entity) {
      return {
        success: false,
        message: `${model} not found`,
      };
    }

    return {
      success: true,
      data: entity,
    };
  } catch (error: any) {
    console.error(`Error getting ${model}:`, error);
    return {
      success: false,
      message: error.message || `Failed to get ${model}`,
    };
  }
}

// Generic function to get all entities with pagination
export async function getEntities(
  model: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  searchField: string = "name"
): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      if (searchField.includes(".")) {
        const [parent, child] = searchField.split(".");
        query = { [`${parent}.${child}`]: { $regex: search, $options: "i" } };
      } else {
        query = { [searchField]: { $regex: search, $options: "i" } };
      }
    }

    const entities = await Entity.find(query).skip(skip).limit(limit);
    const total = await Entity.countDocuments(query);

    return {
      success: true,
      data: {
        data: entities,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error(`Error getting ${model} entities:`, error);
    return {
      success: false,
      message: error.message || `Failed to get ${model} entities`,
    };
  }
}

// Generic function to delete multiple entities
export async function deleteEntities(model: string, ids: string[]): Promise<ActionResponse> {
  try {
    await connectToDatabase();
    let Entity;

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "Blog":
        Entity = Blog;
        break;
      case "TeamMember":
        Entity = TeamMember;
        break;
      case "Product":
        Entity = Product;
        break;
      case "Service":
        Entity = Service;
        break;
      case "User":
        Entity = User;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    const result = await Entity.deleteMany({ _id: { $in: ids } });

    return {
      success: true,
      message: `${result.deletedCount} ${model} entities deleted successfully`,
    };
  } catch (error: any) {
    console.error(`Error deleting ${model} entities:`, error);
    return {
      success: false,
      message: error.message || `Failed to delete ${model} entities`,
    };
  }
}

// User Management Actions
export async function createUser(data: any): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      };
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 10);

    // Create new user
    const user = new User({
      ...data,
      password: hashedPassword,
    });

    await user.save();

    return {
      success: true,
      message: "User created successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error: any) {
    console.error("Error creating user:", error);
    return {
      success: false,
      message: error.message || "Failed to create user",
    };
  }
}

export async function updateUser(id: string, data: any): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    const updateData = { ...data };

    // If password is provided, hash it
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 10);
    } else {
      // Don't update password if not provided
      delete updateData.password;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
      },
    };
  } catch (error: any) {
    console.error("Error updating user:", error);
    return {
      success: false,
      message: error.message || "Failed to update user",
    };
  }
}

export async function getUsers(page: number = 1, limit: number = 10, search: string = ""): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query = {
        $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }],
      };
    }

    const users = await User.find(query).select("-password").skip(skip).limit(limit).sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      success: true,
      data: {
        data: users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    };
  } catch (error: any) {
    console.error("Error getting users:", error);
    return {
      success: false,
      message: error.message || "Failed to get users",
    };
  }
}

export async function deleteUser(id: string): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User deleted successfully",
    };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: error.message || "Failed to delete user",
    };
  }
}

export async function deleteUsers(ids: string[]): Promise<ActionResponse> {
  try {
    await connectToDatabase();

    const result = await User.deleteMany({ _id: { $in: ids } });

    if (result.deletedCount === 0) {
      return {
        success: false,
        message: "No users found to delete",
      };
    }

    return {
      success: true,
      message: `${result.deletedCount} users deleted successfully`,
    };
  } catch (error: any) {
    console.error("Error deleting users:", error);
    return {
      success: false,
      message: error.message || "Failed to delete users",
    };
  }
}

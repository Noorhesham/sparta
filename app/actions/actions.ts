"use server";

import connectToDatabase from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Homepage from "@/models/Homepage";

interface ActionResponse {
  success: boolean;
  message?: string;
  data?: any;
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

    switch (model) {
      case "Homepage":
        Entity = Homepage;
        break;
      case "Blog":
        Entity = Blog;
        break;
      default:
        throw new Error(`Unknown model: ${model}`);
    }

    const deletedEntity = await Entity.findByIdAndDelete(id);

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

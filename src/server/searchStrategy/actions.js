import { HttpError } from "wasp/server";

/**
 * Create a new search session
 */
export const createSearchSession = async ({ name, description }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  if (!name || !name.trim()) {
    throw new HttpError(400, "Session name is required");
  }

  try {
    const newSession = await context.entities.SearchSession.create({
      data: {
        name,
        description,
        userId: context.user.id
      }
    });

    return newSession;
  } catch (error) {
    console.error("Failed to create search session:", error);
    throw new HttpError(500, "Failed to create search session");
  }
};

/**
 * Create a new search query
 */
export const createSearchQuery = async ({ sessionId, query, description }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    // Check if the session exists and belongs to the user
    const session = await context.entities.SearchSession.findUnique({
      where: { id: sessionId }
    });

    if (!session) {
      throw new HttpError(404, "Search session not found");
    }

    if (session.userId !== context.user.id) {
      throw new HttpError(403, "You don't have access to this search session");
    }

    const newQuery = await context.entities.SearchQuery.create({
      data: {
        query,
        description,
        sessionId
      }
    });

    return newQuery;
  } catch (error) {
    // Re-throw HttpError instances
    if (error instanceof HttpError) {
      throw error;
    }
    
    console.error("Failed to create search query:", error);
    throw new HttpError(500, "Failed to create search query");
  }
};

/**
 * Update an existing search query
 */
export const updateSearchQuery = async ({ id, query, description }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    // Check if the query exists and belongs to the user's session
    const existingQuery = await context.entities.SearchQuery.findUnique({
      where: { id },
      include: { searchSession: true }
    });

    if (!existingQuery) {
      throw new HttpError(404, "Search query not found");
    }

    if (existingQuery.searchSession.userId !== context.user.id) {
      throw new HttpError(403, "You don't have access to this search query");
    }

    const updatedQuery = await context.entities.SearchQuery.update({
      where: { id },
      data: {
        query,
        description,
        updatedAt: new Date()
      }
    });

    return updatedQuery;
  } catch (error) {
    // Re-throw HttpError instances
    if (error instanceof HttpError) {
      throw error;
    }
    
    console.error("Failed to update search query:", error);
    throw new HttpError(500, "Failed to update search query");
  }
}; 
import { HttpError } from "wasp/server";

/**
 * Get all search sessions for the current user
 */
export const getSearchSessions = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    return await context.entities.SearchSession.findMany({
      where: { userId: context.user.id },
      orderBy: { updatedAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching search sessions:", error);
    throw new HttpError(500, "Failed to fetch search sessions");
  }
};

/**
 * Get a specific search session by ID
 */
export const getSearchSession = async ({ id }, context) => {
  if (!context.user) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    const session = await context.entities.SearchSession.findUnique({
      where: { id },
      include: {
        searchQueries: {
          orderBy: { updatedAt: 'desc' }
        }
      }
    });

    if (!session) {
      throw new HttpError(404, "Search session not found");
    }

    // Check if the user has access to this session
    if (session.userId !== context.user.id) {
      throw new HttpError(403, "You don't have access to this search session");
    }

    return session;
  } catch (error) {
    // Re-throw HttpError instances
    if (error instanceof HttpError) {
      throw error;
    }
    
    console.error("Error fetching search session:", error);
    throw new HttpError(500, "Failed to fetch search session");
  }
}; 
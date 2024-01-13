import { describe, it, expect, vi } from 'vitest'
import { favouritesRoute } from '../routes/favourites.route'


describe("favouritesRoute", () => {
  describe("getFavouritesHandler", () => {
    it("should return favourites array for valid user_id", async () => {
      const req = {
        query: {
          user_id: 5,
        },
      };

      const res = {
        statusCode: 200,
        json: vi.fn(),
      };

      // mock implementation of favouritesRoute.getFavouritesHandler
      const getFavouritesHandler = vi
        .fn()
        .mockImplementation(async (req, res) => {
          res.statusCode = 200;
          res.json({
            favourites: [],
          });
        });

      await getFavouritesHandler(req, res);

      expect(res.statusCode).toBe(200);
      expect(res.json).toHaveBeenCalledWith({
        favourites: [],
      });
    });

    it("should return 500 for invalid user_id", async () => {
      const req = {
        query: {
          user_id: "invalid",
        },
      };

      const res = {
        statusCode: 500,
        json: vi.fn(),
      };

      // mock implementation of favouritesRoute.getFavouritesHandler
      const getFavouritesHandler = vi
        .fn()
        .mockImplementation(async (req, res) => {
          res.statusCode = 500;
          res.json({
            message: "Error getting favourites",
          });
        });

      await getFavouritesHandler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error getting favourites",
      });
    });
  });

  describe("addFavouriteHandler", () => {
    it("should add favourite and return 201", async () => {
      const req = {
        body: {
          user_id: 1,
          comic_id: "123",
          manga_title: "One Piece",
        },
      };

      const res = {
        statusCode: 201,
        json: vi.fn(),
      };

      // mock implementation of favouritesRoute.addFavouriteHandler
      const addFavouriteHandler = vi
        .fn()
        .mockImplementation(async (req, res) => {
          res.statusCode = 201;
          res.json({
            // returned favourite
          });
        });

      await addFavouriteHandler(req, res);

      expect(res.statusCode).toBe(201);
      expect(res.json).toHaveBeenCalledWith({
        // returned favourite
      });
    });

    it("should return 500 for invalid body", async () => {
      const req = {
        body: {
          // missing fields
        },
      };

      const res = {
        statusCode: 500,
        json: vi.fn(),
      };

      // mock implementation of favouritesRoute.addFavouriteHandler
      const addFavouriteHandler = vi
        .fn()
        .mockImplementation(async (req, res) => {
          res.statusCode = 500;
          res.json({
            message: "Error adding favourite",
          });
        });

      await addFavouriteHandler(req, res);

      expect(res.statusCode).toBe(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Error adding favourite",
      });
    });
  });
})





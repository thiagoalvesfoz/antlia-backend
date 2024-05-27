import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@common/prisma/prisma.service';
import { Category, Image } from '@inventory/entities';
import { CategoryMysqlRepository } from './category-mysql.repository';
import {
  CATEGORY_NAME_PROVIDER,
  CategoryRepository,
} from '@inventory/repository';

// Mock do PrismaService para uso nos testes
const prismaServiceMock = {
  $transaction: jest.fn(),
  category: {
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
  },
  image: {
    create: jest.fn(),
    update: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
  // Inclua outros métodos ou propriedades conforme necessário
};
describe('CategoryMysqlRepository', () => {
  let categoryRepository: CategoryRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CATEGORY_NAME_PROVIDER,
          useClass: CategoryMysqlRepository,
        },
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    categoryRepository = module.get(CATEGORY_NAME_PROVIDER);
  });

  it('should be defined', () => {
    expect(categoryRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category with image', async () => {
      // Arrange
      const category = new Category({ name: 'Test Category', enable: true });

      const image = new Image({
        bytes: Buffer.from('mockBytes'),
        mimetype: 'mockMimetype',
      });

      const idExpected = '1';

      prismaServiceMock.$transaction.mockResolvedValueOnce({
        categoryModel: { ...category, id: idExpected },
        imageModel: { ...image, id: idExpected },
      });

      // Act
      const result = await categoryRepository.create(category);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(idExpected);
      expect(result.name).toBe(category.name);
      expect(result.image).toBeDefined();
      expect(result.image.id).toBe(idExpected);
      expect(result.image.bytes).toBe(image.bytes);
      expect(result.image.mimetype).toBe(image.mimetype);
    });

    it('should create a new category without image', async () => {
      // Arrange
      const category = new Category({ name: 'Test Category', enable: true });

      const idExpected = '1';

      prismaServiceMock.$transaction.mockResolvedValueOnce({
        categoryModel: { ...category, id: idExpected },
        imageModel: null,
      });

      // Act
      const result = await categoryRepository.create(category);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(idExpected);
      expect(result.name).toBe(category.name);
      expect(result.image).toBeUndefined();
    });

    it('should throw error if image creation fails', async () => {
      // Arrange
      const category = new Category({ name: 'Test Category', enable: true });

      const error = new Error('Image creation failed');

      prismaServiceMock.$transaction.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(categoryRepository.create(category)).rejects.toThrowError(
        error,
      );
    });
  });
});

/**
 * Validates and sanitizes query parameters for API routes
 */

export interface PaginationParams {
  page: number;
  size: number;
  sort: number;
}

export interface ValidationResult {
  valid: boolean;
  params?: PaginationParams;
  error?: string;
}

/**
 * Validates pagination query parameters
 * @param page - Page number (default: 1)
 * @param size - Items per page (default: 20, max: 100)
 * @param sort - Sort order (default: 1, must be 1 or -1)
 * @returns ValidationResult with validated parameters or error
 */
export function validatePaginationParams(
  page: string | null,
  size: string | null,
  sort: string | null
): ValidationResult {
  // Default values
  let pageNum = 1;
  let sizeNum = 20;
  let sortNum = 1;

  // Validate page
  if (page !== null) {
    const parsedPage = parseInt(page, 10);
    if (isNaN(parsedPage) || parsedPage < 1) {
      return {
        valid: false,
        error: 'Invalid page parameter. Must be a positive integer.',
      };
    }
    pageNum = parsedPage;
  }

  // Validate size
  if (size !== null) {
    const parsedSize = parseInt(size, 10);
    if (isNaN(parsedSize) || parsedSize < 1 || parsedSize > 100) {
      return {
        valid: false,
        error: 'Invalid size parameter. Must be between 1 and 100.',
      };
    }
    sizeNum = parsedSize;
  }

  // Validate sort
  if (sort !== null) {
    const parsedSort = parseInt(sort, 10);
    if (isNaN(parsedSort) || (parsedSort !== 1 && parsedSort !== -1)) {
      return {
        valid: false,
        error: 'Invalid sort parameter. Must be 1 (ascending) or -1 (descending).',
      };
    }
    sortNum = parsedSort;
  }

  return {
    valid: true,
    params: {
      page: pageNum,
      size: sizeNum,
      sort: sortNum,
    },
  };
}

/**
 * Validates that a string ID parameter is not empty
 */
export function validateId(id: string | undefined): boolean {
  return typeof id === 'string' && id.trim().length > 0;
}


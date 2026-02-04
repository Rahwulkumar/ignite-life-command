/**
 * Type definitions for Tiptap JSON content structure
 * Used for parsing and extracting text from rich text editor content
 */

export interface TiptapTextNode {
    type: 'text';
    text: string;
    marks?: Array<{
        type: string;
        attrs?: Record<string, unknown>;
    }>;
}

export interface TiptapNode {
    type: string;
    attrs?: Record<string, unknown>;
    content?: Array<TiptapNode | TiptapTextNode>;
}

export interface TiptapDocument {
    type: 'doc';
    content: TiptapNode[];
}

/**
 * Safely extracts preview text from Tiptap JSON content
 * @param content - The content object from the database (can be any type)
 * @param maxLength - Maximum length of preview text (default: 100)
 * @returns Preview text or null if extraction fails
 */
export function extractTiptapPreviewText(
    content: unknown,
    maxLength: number = 100
): string | null {
    try {
        // Type guard: check if content is an object
        if (!content || typeof content !== 'object') {
            return null;
        }

        // Type assertion with validation
        const doc = content as Partial<TiptapDocument>;

        // Validate structure
        if (!doc.content || !Array.isArray(doc.content)) {
            return null;
        }

        // Extract text from first paragraph
        const firstParagraph = doc.content[0];
        if (!firstParagraph || !firstParagraph.content) {
            return null;
        }

        // Get first text node
        const firstTextNode = firstParagraph.content[0];
        if (!firstTextNode || !('text' in firstTextNode)) {
            return null;
        }

        const text = (firstTextNode as TiptapTextNode).text;

        // Truncate if needed
        if (text.length > maxLength) {
            return text.slice(0, maxLength) + '...';
        }

        return text;
    } catch (error) {
        console.warn('Failed to extract preview text from Tiptap content:', error);
        return null;
    }
}

/**
 * Extracts all text from Tiptap JSON content (recursive)
 * @param content - The content object from the database
 * @returns Full text content or empty string
 */
export function extractTiptapFullText(content: unknown): string {
    try {
        if (!content || typeof content !== 'object') {
            return '';
        }

        const doc = content as Partial<TiptapDocument>;
        if (!doc.content || !Array.isArray(doc.content)) {
            return '';
        }

        const extractTextFromNode = (node: TiptapNode | TiptapTextNode): string => {
            if ('text' in node) {
                return (node as TiptapTextNode).text;
            }

            if ('content' in node && Array.isArray(node.content)) {
                return node.content.map(extractTextFromNode).join(' ');
            }

            return '';
        };

        return doc.content.map(extractTextFromNode).join('\n\n').trim();
    } catch (error) {
        console.warn('Failed to extract full text from Tiptap content:', error);
        return '';
    }
}

/**
 * Validates if content is a valid Tiptap document
 * @param content - The content to validate
 * @returns True if valid Tiptap document
 */
export function isValidTiptapContent(content: unknown): content is TiptapDocument {
    if (!content || typeof content !== 'object') {
        return false;
    }

    const doc = content as Partial<TiptapDocument>;
    return (
        doc.type === 'doc' &&
        Array.isArray(doc.content) &&
        doc.content.length > 0
    );
}

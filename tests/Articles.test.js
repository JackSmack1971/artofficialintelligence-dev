import { jsx as _jsx } from "react/jsx-runtime";
import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Articles from '@/pages/Articles';
const mockArticles = [
    {
        id: '1',
        title: 'One',
        excerpt: 'Ex',
        author: { id: 'a1', name: 'Jane', avatar: 'https://example.com/a.png' },
        image: 'https://example.com/img.png'
    }
];
const mockFetch = () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => mockArticles }));
};
afterEach(() => {
    vi.restoreAllMocks();
});
describe('Articles page', () => {
    it('renders list of articles', async () => {
        mockFetch();
        render(_jsx(Articles, {}));
        expect(await screen.findByText('One')).toBeInTheDocument();
    });
});

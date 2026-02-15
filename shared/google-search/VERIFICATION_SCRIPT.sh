#!/bin/bash
# Quick verification script to test if redirect loop is fixed

echo "🔍 Testing URLs after deployment..."
echo ""

echo "1. Testing /menu/ (WITH trailing slash):"
curl -sI https://caravan-restaurant.de/menu/ | grep -E "HTTP|location" | head -2
echo ""

echo "2. Testing /menu (WITHOUT trailing slash):"
curl -sI https://caravan-restaurant.de/menu | grep -E "HTTP|location" | head -2
echo ""

echo "3. Testing sitemap:"
curl -s https://caravan-restaurant.de/sitemap.xml | grep "menu"
echo ""

echo "✅ Expected results:"
echo "  - /menu/ should return: HTTP/2 200"
echo "  - /menu should return: HTTP/2 301 + location: /menu/"
echo "  - Sitemap should show: <loc>https://caravan-restaurant.de/menu/</loc>"

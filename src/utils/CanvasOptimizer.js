class CanvasOptimizer {
    constructor() {
        this.offscreenCanvases = new Map();
        this.imageCache = new Map();
        this.lastRenderTime = 0;
        this.renderQueue = [];
    }
    
    // Create offscreen canvas for complex drawings
    createOffscreenCanvas(key, width, height, drawFunction) {
        if (this.offscreenCanvases.has(key)) {
            return this.offscreenCanvases.get(key);
        }
        
        const offscreenCanvas = new OffscreenCanvas ? 
            new OffscreenCanvas(width, height) : 
            document.createElement('canvas');
            
        if (!OffscreenCanvas) {
            offscreenCanvas.width = width;
            offscreenCanvas.height = height;
        }
        
        const ctx = offscreenCanvas.getContext('2d');
        if (drawFunction) {
            drawFunction(ctx);
        }
        
        this.offscreenCanvases.set(key, { canvas: offscreenCanvas, ctx });
        return this.offscreenCanvases.get(key);
    }
    
    // Clear offscreen canvas cache
    clearOffscreenCache(key = null) {
        if (key) {
            this.offscreenCanvases.delete(key);
        } else {
            this.offscreenCanvases.clear();
        }
    }
    
    // Optimized circle drawing
    drawOptimizedCircle(ctx, x, y, radius, fillStyle = '#fff', useCache = true) {
        const cacheKey = `circle_${radius}_${fillStyle}`;
        
        if (useCache && radius > 10) {
            if (!this.offscreenCanvases.has(cacheKey)) {
                const size = radius * 2 + 2;
                const offscreen = this.createOffscreenCanvas(cacheKey, size, size, (offCtx) => {
                    offCtx.fillStyle = fillStyle;
                    offCtx.beginPath();
                    offCtx.arc(radius + 1, radius + 1, radius, 0, Math.PI * 2);
                    offCtx.fill();
                });
            }
            
            const cached = this.offscreenCanvases.get(cacheKey);
            ctx.drawImage(cached.canvas, x - radius - 1, y - radius - 1);
        } else {
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Optimized rectangle drawing with rounded corners
    drawOptimizedRoundedRect(ctx, x, y, width, height, radius, fillStyle = '#fff', useCache = true) {
        const cacheKey = `roundedRect_${width}_${height}_${radius}_${fillStyle}`;
        
        if (useCache && (width > 50 || height > 50)) {
            if (!this.offscreenCanvases.has(cacheKey)) {
                const offscreen = this.createOffscreenCanvas(cacheKey, width, height, (offCtx) => {
                    offCtx.fillStyle = fillStyle;
                    offCtx.beginPath();
                    offCtx.roundRect ? 
                        offCtx.roundRect(0, 0, width, height, radius) :
                        this.fallbackRoundedRect(offCtx, 0, 0, width, height, radius);
                    offCtx.fill();
                });
            }
            
            const cached = this.offscreenCanvases.get(cacheKey);
            ctx.drawImage(cached.canvas, x, y);
        } else {
            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.roundRect ? 
                ctx.roundRect(x, y, width, height, radius) :
                this.fallbackRoundedRect(ctx, x, y, width, height, radius);
            ctx.fill();
        }
    }
    
    // Fallback for browsers without roundRect
    fallbackRoundedRect(ctx, x, y, width, height, radius) {
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
    
    // Batch rendering for similar objects
    batchRender(ctx, renderFunction, objects, maxBatchSize = 50) {
        for (let i = 0; i < objects.length; i += maxBatchSize) {
            const batch = objects.slice(i, i + maxBatchSize);
            ctx.save();
            batch.forEach(obj => renderFunction(ctx, obj));
            ctx.restore();
        }
    }
    
    // Smart canvas clearing (only clear dirty regions)
    smartClear(ctx, dirtyRegions = null) {
        if (!dirtyRegions || dirtyRegions.length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        } else {
            dirtyRegions.forEach(region => {
                ctx.clearRect(region.x, region.y, region.width, region.height);
            });
        }
    }
    
    // Frame rate limiter
    shouldRender(targetFPS = 60) {
        const now = performance.now();
        const targetFrameTime = 1000 / targetFPS;
        
        if (now - this.lastRenderTime >= targetFrameTime) {
            this.lastRenderTime = now;
            return true;
        }
        return false;
    }
    
    // Viewport culling - only render objects in view
    isInViewport(object, cameraX = 0, cameraY = 0, viewWidth = 800, viewHeight = 600) {
        const objRight = object.x + (object.width || 0);
        const objBottom = object.y + (object.height || 0);
        const viewRight = cameraX + viewWidth;
        const viewBottom = cameraY + viewHeight;
        
        return !(object.x > viewRight || 
                objRight < cameraX || 
                object.y > viewBottom || 
                objBottom < cameraY);
    }
    
    // Object pooling for frequently created/destroyed objects
    createObjectPool(createFunction, resetFunction, initialSize = 10) {
        const pool = {
            objects: [],
            active: [],
            create: createFunction,
            reset: resetFunction
        };
        
        // Pre-populate pool
        for (let i = 0; i < initialSize; i++) {
            pool.objects.push(createFunction());
        }
        
        pool.get = function() {
            let obj = this.objects.pop();
            if (!obj) {
                obj = this.create();
            }
            this.active.push(obj);
            return obj;
        };
        
        pool.release = function(obj) {
            const index = this.active.indexOf(obj);
            if (index > -1) {
                this.active.splice(index, 1);
                this.reset(obj);
                this.objects.push(obj);
            }
        };
        
        pool.releaseAll = function() {
            while (this.active.length > 0) {
                this.release(this.active[0]);
            }
        };
        
        return pool;
    }
    
    // Texture atlas for sprite batching
    createTextureAtlas(sprites) {
        let totalWidth = 0;
        let maxHeight = 0;
        
        sprites.forEach(sprite => {
            totalWidth += sprite.width;
            maxHeight = Math.max(maxHeight, sprite.height);
        });
        
        const atlasCanvas = document.createElement('canvas');
        atlasCanvas.width = totalWidth;
        atlasCanvas.height = maxHeight;
        const atlasCtx = atlasCanvas.getContext('2d');
        
        const atlas = { canvas: atlasCanvas, sprites: {} };
        let currentX = 0;
        
        sprites.forEach(sprite => {
            atlasCtx.drawImage(sprite.image, currentX, 0);
            atlas.sprites[sprite.name] = {
                x: currentX,
                y: 0,
                width: sprite.width,
                height: sprite.height
            };
            currentX += sprite.width;
        });
        
        return atlas;
    }
    
    // Memory cleanup
    cleanup() {
        this.clearOffscreenCache();
        this.imageCache.clear();
        this.renderQueue = [];
    }
}

// Singleton instance
const canvasOptimizer = new CanvasOptimizer();

export default canvasOptimizer;
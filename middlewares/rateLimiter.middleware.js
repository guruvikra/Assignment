import { rateLimit } from 'express-rate-limit'
import { RateLimiterMemory } from 'rate-limiter-flexible';

export const limiter=rateLimit({
    windowMs: 60 * 60*1000, // 1 minute
    max: 20, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'

});


export const rateLimitPerSec=new RateLimiterMemory({
    points: 1, // 100 requests
    duration: 1, // per second
})

export const rateLimitPerMin=new RateLimiterMemory({
    points: 2, // 6000 requests
    duration: 60, // per minute
})
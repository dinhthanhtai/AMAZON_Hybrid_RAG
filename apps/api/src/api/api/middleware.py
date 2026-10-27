from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import logging
import uuid

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")

logger = logging.getLogger(__name__)

class RequestIDMiddleware(BaseHTTPMiddleware):
  """"Middleware that adds a unique request ID to each request"""
  
  async def dispatch(self, request: Request, call_next):
      request_id = str(uuid.uuid4())
      request.state.request_id = request_id
      
      logger.info(f"Request started: {request_id} - {request.method} {request.url.path}")
      
      response = await call_next(request)
      response.headers["X-Request-ID"] = request_id
      logger.info(f"Request completed: {request_id} - {request.method} {request.url.path} - Status code: {response.status_code}")
      return response
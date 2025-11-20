import time
from collections import deque
from typing import Dict

class RateLimiter:
    """
    Simple per-user sliding-window limiter.
    Allows max_calls in period_seconds.
    """

    def __init__(self, max_calls: int = 10, period_seconds: int = 60):
        self.max_calls = max_calls
        self.period = period_seconds
        # Store is a dictionary mapping username to a deque (double-ended queue)
        # of call timestamps.
        self.store: Dict[str, deque] = {}

    def allow(self, user_key: str) -> bool:
        """
        Checks if the user is allowed to make a call based on the rate limit.
        Returns True if allowed, False otherwise.
        """
        now = time.time()
        
        # Get the call history for the user, or initialize an empty deque
        timestamps = self.store.setdefault(user_key, deque())

        # 1. Clean up old timestamps (sliding window)
        # Remove any timestamp that is outside the current period window
        while timestamps and timestamps[0] < now - self.period:
            timestamps.popleft()

        # 2. Check the limit
        if len(timestamps) < self.max_calls:
            # Add the current time and allow the call
            timestamps.append(now)
            return True
        else:
            # Limit exceeded
            return False
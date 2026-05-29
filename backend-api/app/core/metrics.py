from prometheus_client import Counter, Histogram, Gauge

REQUEST_COUNT = Counter(
    "genque_http_requests_total",
    "Total API requests",
    ["method", "path", "status_code"],
)

REQUEST_LATENCY = Histogram(
    "genque_http_request_duration_seconds",
    "API request latency",
    ["method", "path"],
)

AUTH_FAILURES = Counter("genque_auth_failures_total", "Authentication failures")
LLM_LATENCY = Histogram("genque_llm_request_duration_seconds", "LLM generation latency")
VECTOR_LATENCY = Histogram("genque_vector_search_duration_seconds", "Vector search latency")
INGESTION_FAILURES = Counter("genque_ingestion_failures_total", "Ingestion failures")
QUEUE_DEPTH = Gauge("genque_worker_queue_depth", "Queued ingestion and generation jobs")

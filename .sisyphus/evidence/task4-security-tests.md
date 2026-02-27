# Task 4: Secure File Reading API - Security Tests

## Test 1: Valid .md file
```bash
curl -s "http://127.0.0.1:3000/?path=/tmp/md-test/test.md"
```
{"path":"/tmp/md-test/test.md","content":"# Test Markdown File\nThis is a test markdown file with some content.\n"}

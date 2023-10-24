export async function GET(request: Request) {
  const res = {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    text: 'Hello World',
  }

  return Response.json(res.text)
}

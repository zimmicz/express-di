import "reflect-metadata";
import express from "express";
import { Container, injectable, inject } from "inversify";

const app = express();

// curl http://localhost:3100\?type\=flex
// curl http://localhost:3100\?type\=temp
app.get("/", (req, res) => {
  // @ts-expect-error err
  const svc = container.getNamed<Worker>("Worker", req.query.type);
  res.send(svc.getName());
});

app.listen(3100, () => {
  console.log("Listening on http://localhost:3000");
});

interface Worker {
  getName(): string;
}

@injectable()
class FlexWorker implements Worker {
  public getName() {
    return "FlexWorker";
  }
}

@injectable()
class TempWorker implements Worker {
  public getName() {
    return "TempWorker";
  }
}

const container = new Container();
container.bind<Worker>("Worker").to(FlexWorker).whenTargetNamed("flex");
container.bind<Worker>("Worker").to(TempWorker).whenTargetNamed("temp");

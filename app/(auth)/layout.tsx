import React from "react";

//const { data, isLoading, isError } = useUsers();

const LoginRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  /* 
        setPin("");
      }; */

  //if (isLoading) return <p>Loading...</p>;
  //if (isError) return <p>Error loading user profiles.</p>;
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  h-full">
      <div className="text-center space-y-8 h-fit ">{children}</div>
      {/*<>  <Dashboard /> </>
         <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 ">
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2">Place an Order</h3>
                  <p className="text-muted-foreground">
                    Receive orders instantly as they come in from your POS
                    system
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-gray-800 text-gray-50 m-auto w-24"
                    variant="default"
                  >
                    Go
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2">Real-time Order Tracking</h3>
                  <p className="text-muted-foreground">
                    Track preparation times and ensure orders are completed on
                    schedule
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gray-800 text-gray-50 m-auto w-24">
                    Go
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2">Kitchen Management</h3>
                  <p className="text-muted-foreground">
                    Organize your kitchen workflow with customizable display
                    options
                  </p>
                </CardContent>
                <CardFooter>
                  <Button className="bg-gray-800 text-gray-50 m-auto w-24">
                    Go
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="text-center space-y-8">
              <div className="space-y-4">
                <h2 className="text-gray-900">Station ID: {pin}</h2>
                {/*    <p className="text-muted-foreground"></p> 
              </div>

              <Card className="max-w-md mx-auto">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2">System Ready</h3>
                  <p className="text-muted-foreground">
                    Waiting for incoming orders...
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    className="bg-gray-800 text-gray-50"
                    variant="default"
                  >
                    Go
                  </Button>
                </CardFooter>
              </Card>
            </div> 
          </>*/}
    </main>
  );
};

export default LoginRoot;

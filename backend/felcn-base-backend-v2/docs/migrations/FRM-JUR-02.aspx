<%@ Page Title="" Language="C#" MasterPageFile="~/PaginaPrin.master" MaintainScrollPositionOnPostback="true" AutoEventWireup="true" CodeFile="FRM-JUR-02.aspx.cs" Inherits="Forms_FRM_JUR_02" %>

<asp:Content ID="Content1" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
    <div class="animate__animated p-6">
    <div x-data="sales">
        <ol class="flex text-primary font-semibold dark:text-white-dark">
            <li class="bg-[#ebedf2] rounded-tl-md rounded-bl-md dark:bg-[#1b2e4b]"><a href="Default3" class="p-1.5 ltr:pl-3 rtl:pr-3 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-[#ebedf2] before:z-[1] dark:before:border-l-[#1b2e4b] hover:text-primary/70 dark:hover:text-white-dark/70">Inicio</a></li>
            <li class="bg-[#ebedf2] dark:bg-[#1b2e4b]"><a class="bg-primary text-white-light p-1.5 ltr:pl-6 rtl:pr-6 ltr:pr-2 rtl:pl-2 relative  h-full flex items-center before:absolute ltr:before:-right-[15px] rtl:before:-left-[15px] rtl:before:rotate-180 before:inset-y-0 before:m-auto before:w-0 before:h-0 before:border-[16px] before:border-l-[15px] before:border-r-0 before:border-t-transparent before:border-b-transparent before:border-l-primary before:z-[1]">FORMULARIO JURIDICO 2: SITUACION JURDICA DE PERSONAS</a></li>
        </ol>
    </div>
    <br />
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">INFORMACION DEL CASO
                <asp:Label ID="lblidcaso" runat="server" Visible="False"></asp:Label>
            </h5>
        </div>
        <div class="mb-5">
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Caso</div>
                    <asp:Label ID="txtnrocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                </div>
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Numero de Operativo</div>
                    <asp:Label ID="txtnroop" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="150px"></asp:Label>
                </div>
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Nombre del Caso</div>
                    <asp:Label ID="txtnombrecaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="250px"></asp:Label>
                </div>
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Asignado al Caso</div>
                    <asp:Label ID="txtasignadocaso" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                </div>
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Fiscal Asignado</div>
                    <asp:Label ID="txtfiscalasignado" runat="server" Text="" class="form-input form-input-sm" Font-Bold="True" Width="350px"></asp:Label>
                </div>
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Num. Caso Perdida de Dominio</div>
                    <asp:Label ID="txtperdom" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                </div>                
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">CUD Fiscalia</div>
                    <asp:Label ID="lblcud" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                </div>               
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <div class="flex">
                    <div class="bg-[#eee] flex justify-center items-center ltr:rounded-l-md rtl:rounded-r-md px-3 font-semibold border ltr:border-r-0 rtl:border-l-0 border-[#e0e6ed] dark:border-[#17263c] dark:bg-[#1b2e4b]">Etapa investigativa</div>
                    <asp:Label ID="lbletapa" runat="server" class="form-input form-input-sm" Font-Bold="True" Width="200px"></asp:Label>
                </div>                
            </div>
            <br />
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-4">
                <asp:GridView ID="gridpersonas" runat="server" AutoGenerateColumns="False" Width="100%" onselectedindexchanged="gridpersonas_SelectedIndexChanged" CellPadding="4" ForeColor="#333333" GridLines="None">
                        <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                        <Columns>
                            <asp:BoundField DataField="Det1" HeaderText="Cod. Id." />
                            <asp:BoundField DataField="Det2" HeaderText="Nombre y Apellidos" />
                            <asp:BoundField DataField="Det3" HeaderText="Nacionalidad" />
                            <asp:BoundField DataField="Det4" HeaderText="Genero" />
                            <asp:BoundField DataField="Det5" HeaderText="Fecha Nac." />
                            <asp:BoundField DataField="Det6" HeaderText="Estado Civil" />
                            <asp:BoundField DataField="Det7" HeaderText="Serie" />
                            <asp:BoundField DataField="Det8" HeaderText="Seccion" />
                            <asp:BoundField DataField="Det9" HeaderText="Direccion" />
                            <asp:BoundField DataField="Det10" HeaderText="Tarjeta Prontuario" />
                            <asp:BoundField DataField="Det11" HeaderText="Condicion de la Persona" />
                            <asp:TemplateField ShowHeader="False">
                                <ItemTemplate>
                                    <asp:Button ID="Button1" runat="server" CausesValidation="False" CommandName="Select" Text="Seleccionar" class="btn btn-dark btn-sm"/>
                                </ItemTemplate>
                            </asp:TemplateField>
                        </Columns>
                        <EditRowStyle BackColor="#999999" />
                        <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                        <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                        <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                        <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                        <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                        <SortedAscendingCellStyle BackColor="#E9E7E2" />
                        <SortedAscendingHeaderStyle BackColor="#506C8C" />
                        <SortedDescendingCellStyle BackColor="#FFFDF8" />
                        <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                    </asp:GridView>
            </div>
        </div>
    </div>
    <asp:Label ID="lblidoperativo" runat="server" Visible="False"></asp:Label>
    <asp:Label ID="LblIdDet" runat="server" Visible="False"></asp:Label>
    <br />
    <div class="panel">
        <div class="mb-5 flex items-center justify-between">
            <h5 class="text-lg font-semibold dark:text-white-light">SITUACION LEGAL DEL IMPLICADO</h5>
        </div>
        <div class="mb-5">
            <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                <thead>
                    <tr>
                        <th class="head0" style="width: 366px">Primera Instancia</th>
                        <th class="head1">Datos de Ingreso</th>
                    </tr>
                </thead>
                <tfoot>
                </tfoot>
                <tbody>
                    <tr>
                        <td style="width: 366px">Situación Legal</td>
                        <td>
                            <asp:DropDownList ID="ddlsitualeg" runat="server" class="form-select form-select-sm text-white-dark" Width="250px"></asp:DropDownList>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px">Nro. de Resolución del Acta de Medida Cautelar</td>
                        <td>
                            <asp:TextBox ID="txtsituresolucion" runat="server" Width="150px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px">Departamento, Provincia, Lugar</td>
                        <td>
                            <asp:TextBox ID="txtsitudep" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px">Fecha de la Resolución del Acta de Medida Cautelar</td>
                        <td>
                            <asp:TextBox ID="txtsitufechares" runat="server" Width="150px" placeholder="" class="form-input form-input-sm" x-tooltip="Ej: 25/11/2025"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px">Autoridad (Nombre del Juez)</td>
                        <td>
                            <asp:TextBox ID="txtsitujuez" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px">Juzgado o Tribunal</td>
                        <td>
                            <asp:TextBox ID="txtsitujuz" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                        </td>
                    </tr>
                    <tr>
                        <td style="width: 366px"></td>
                        <td>
                            <asp:Button ID="btnsituacion" runat="server" Font-Bold="True" Text="GUARDAR SITUACION LEGAL" class="btn btn-success btn-sm" OnClick="btnsituacion_Click" />
                        </td>
                    </tr>                   
                </tbody>
            </table>
            <br />
            <asp:GridView ID="gridsituacion" runat="server" AutoGenerateColumns="False" Width="100%" CellPadding="4" ForeColor="#333333" GridLines="None">
                <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                <Columns>
                    <asp:BoundField DataField="Sl1" HeaderText="Id" />
                    <asp:BoundField DataField="Sl2" HeaderText="Situación Legal" />
                    <asp:BoundField DataField="Sl3" HeaderText="Nro. de resolución" />
                    <asp:BoundField DataField="Sl4" HeaderText="Lugar" />
                    <asp:BoundField DataField="Sl5" DataFormatString="{0:D}" HeaderText="Fecha" />
                    <asp:BoundField DataField="Sl6" HeaderText="Autoridad" />
                    <asp:BoundField DataField="Sl7" HeaderText="Fiscalía, Juzgado o Tribunal" />                                    
                </Columns>
                <EditRowStyle BackColor="#999999" />
                <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                <SortedAscendingCellStyle BackColor="#E9E7E2" />
                <SortedAscendingHeaderStyle BackColor="#506C8C" />
                <SortedDescendingCellStyle BackColor="#FFFDF8" />
                <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
            </asp:GridView>
        </div>
    </div>
    <br />
        <div class="panel">
            <div class="mb-5 flex items-center justify-between">
                <h5 class="text-lg font-semibold dark:text-white-light">ETAPA DEL PROCESO</h5>
            </div>
            <div class="mb-5">
                <table cellpadding="0" cellspacing="0" border="0" class="table-responsive">
                    <thead>
                        <tr>
                            <th class="head0" style="width: 238px">Informacion
                            </th>
                            <th class="head1">Datos de Ingreso
                            </th>
                        </tr>
                    </thead>
                    <tfoot>
                    </tfoot>
                    <tbody>
                        <tr>
                            <td style="width: 238px">Etapa del proceso</td>
                            <td>
                                <asp:DropDownList ID="ddletapa" runat="server" AutoPostBack="True"  class="form-select form-select-sm text-white-dark" OnSelectedIndexChanged="ddletapa_SelectedIndexChanged" Width="350px"></asp:DropDownList>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">Estado del Proceso</td>
                            <td>
                                <asp:DropDownList ID="ddlestado" runat="server"  class="form-select form-select-sm text-white-dark" Width="350px"></asp:DropDownList>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">Nro. de Resolucion</td>
                            <td>
                                <asp:TextBox ID="txtetapanrres" runat="server" Width="150px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">
                                Departamento, Provincia, Lugar</td>
                            <td>
                                <asp:TextBox ID="txtetadepart" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">Fecha de la Resolucion</td>
                            <td>
                                <asp:TextBox ID="txtetafecha" runat="server" Width="150px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">Autoridad que emite la Resolucion</td>
                            <td>
                                <asp:TextBox ID="txtetaautoridad" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="width: 238px">Fiscalia, Juzgado o Tribunal</td>
                            <td>
                                <asp:TextBox ID="txtetafiscalia" runat="server" Width="350px" placeholder="" class="form-input form-input-sm"></asp:TextBox>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-style: italic; font-weight: bold; font-size: small; font-family: 'Times New Roman'; width: 238px;">
                                &nbsp;</td>
                            <td>
                                <asp:Button ID="btnguardaetapa" runat="server" Font-Bold="True" Text="GUARDAR ETAPA"  class="btn btn-success btn-sm" OnClick="btnguardaetapa_Click"/>                                
                            </td>
                        </tr>                       
                    </tbody>
                </table>
                <br />
                <asp:GridView ID="GridView3" runat="server" AutoGenerateColumns="False" Width="100%" CellPadding="4" ForeColor="#333333" GridLines="None">
                    <AlternatingRowStyle BackColor="White" ForeColor="#284775" />
                    <Columns>
                        <asp:BoundField DataField="Ep1" HeaderText="Id" />
                        <asp:BoundField DataField="Ep2" HeaderText="Etapa del proceso"></asp:BoundField>
                        <asp:BoundField DataField="Ep3" HeaderText="Estado del proceso" />
                        <asp:BoundField DataField="Ep4" HeaderText="Nro. de resolución" />
                        <asp:BoundField DataField="Ep5" HeaderText="Lugar" />
                        <asp:BoundField DataField="Ep6" DataFormatString="{0:D}" HeaderText="Fecha" />
                        <asp:BoundField DataField="Ep7" HeaderText="Autoridad" />
                        <asp:BoundField DataField="Ep8" HeaderText="Fiscalía, Juzgado o Tribunal" />                        
                    </Columns>
                    <EditRowStyle BackColor="#999999" />
                    <FooterStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                    <HeaderStyle BackColor="#5D7B9D" Font-Bold="True" ForeColor="White" />
                    <PagerStyle BackColor="#284775" ForeColor="White" HorizontalAlign="Center" />
                    <RowStyle BackColor="#F7F6F3" ForeColor="#333333" />
                    <SelectedRowStyle BackColor="#E2DED6" Font-Bold="True" ForeColor="#333333" />
                    <SortedAscendingCellStyle BackColor="#E9E7E2" />
                    <SortedAscendingHeaderStyle BackColor="#506C8C" />
                    <SortedDescendingCellStyle BackColor="#FFFDF8" />
                    <SortedDescendingHeaderStyle BackColor="#6F8DAE" />
                </asp:GridView>
            </div>
        </div>
</div>
</asp:Content>

